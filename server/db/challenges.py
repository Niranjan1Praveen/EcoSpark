import os
import logging
import sqlite3
import json
import google.generativeai as genai
from time import sleep
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

def fetch_user_record(conn, table, user_identifier, column_name):
    """
    Fetch a single row from a table based on the given user identifier.
    'column_name' is the column used to identify the user (e.g., 'id', 'user_id', or 'UserID').
    """
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    query = f"SELECT * FROM {table} WHERE {column_name} = ?"
    row = cursor.execute(query, (user_identifier,)).fetchone()
    return dict(row) if row else {}

def build_flat_json(user_id, conn):
    """
    Retrieves data for a given user from all tables and builds a flat JSON structure.
    Each key is in the format 'table_column' to ensure uniqueness.
    """
    # Fetch records from each table.
    water_record = fetch_user_record(conn, "water_bills", user_id, "id")
    electricity_record = fetch_user_record(conn, "electricity_bills", user_id, "UserID")
    appliances_record = fetch_user_record(conn, "appliances", user_id, "UserID")
    # For UserResponses, assume user_id is stored as text.
    responses_record = fetch_user_record(conn, "UserResponses", str(user_id), "UserID")
    
    # Create a flat dictionary merging all records.
    flat_data = {}
    for table_name, record in [
        ("water_bills", water_record),
        ("electricity_bills", electricity_record),
        ("appliances", appliances_record),
        ("UserResponses", responses_record)
    ]:
        for key, value in record.items():
            flat_key = f"{table_name}_{key}"
            flat_data[flat_key] = value

    return flat_data

def parse_response(response_text: str) -> list:
    """
    Parses the response text from the Gemini API into a list of challenges.
    Splits the response by newlines and strips whitespace.
    """
    challenges = [line.strip() for line in response_text.split("\n") if line.strip()]
    return challenges

def generate_challenges(json_data: dict) -> list:
    """
    Passes the JSON structure through the Gemini API and expects a list of 4 challenges as strings.
    """
    api_key = os.getenv("GOOGLE_GENAI_API_KEY")
    if not api_key:
        logging.error("Gemini API key missing from .env file.")
        raise SystemExit(1)
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    prompt = f"""
    Given the following JSON data extracted from user records:
    {json.dumps(json_data, indent=2)}
    
    CONTEXT: Using the provided JSON data on electricity and water usage, create a detailed 4 tasks of daily, easy-to-follow tasks that users can implement to reduce their bills. Each task should be specific, actionable, and focused on promoting efficient energy and water consumption 
    TASK: Generate a list with exactly 4 strings, these strings are challenges. Do not include any additional formatting, code, or explanations.    
    """
    for attempt in range(3):
        try:
            response = model.generate_content(prompt)
            # Parse the response into a list
            challenges = parse_response(response.text.strip())
            # Validate that the response is a list of 4 strings.
            if isinstance(challenges, list) and len(challenges) == 4:
                return challenges
            else:
                logging.warning(f"Unexpected response format: {challenges}")
        except Exception as e:
            logging.warning(f"API attempt {attempt + 1} failed: {e}")
            sleep(2)
    
    logging.error("Failed to generate challenges after 3 attempts.")
    return []

def get_latest_user_id(conn):
    """
    Fetches the latest UserID from the UsersTable (or any table that contains UserID).
    """
    cursor = conn.cursor()
    query = "SELECT UserID FROM UsersTable ORDER BY UserID DESC LIMIT 1"
    cursor.execute(query)
    row = cursor.fetchone()
    if row:
        return row[0]  # Return the latest UserID
    else:
        logging.error("No users found in the database.")
        raise SystemExit(1)

def create_user_challenges_table(conn):
    """
    Creates the UserChallenges table if it doesn't already exist.
    """
    cursor = conn.cursor()
    query = """
    CREATE TABLE IF NOT EXISTS UserChallenges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        challenge TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES UsersTable(UserID)
    )
    """
    cursor.execute(query)
    conn.commit()

def store_challenges(conn, user_id, challenges):
    """
    Stores the generated challenges in the UserChallenges table.
    """
    cursor = conn.cursor()
    for challenge in challenges:
        query = "INSERT INTO UserChallenges (user_id, challenge) VALUES (?, ?)"
        cursor.execute(query, (user_id, challenge))
    conn.commit()

# Create Flask app and enable CORS for cross-origin requests.
app = Flask(__name__)
CORS(app)

@app.route('/get_challenges', methods=['GET'])
def get_challenges_endpoint():
    """
    Flask endpoint to fetch challenges generated by the Gemini API.
    Returns a JSON object with the list of challenges.
    """
    db_path = "Server.db"
    try:
        conn = sqlite3.connect(db_path)
        
        # Create the UserChallenges table if it doesn't exist
        create_user_challenges_table(conn)
        
        # Fetch the latest UserID
        user_id = get_latest_user_id(conn)
        logging.info(f"Using UserID: {user_id}")
        
        # Build JSON data for the latest user
        user_json_data = build_flat_json(user_id, conn)
        json_output = json.dumps(user_json_data, indent=4)
        
        # Generate challenges using the Gemini API
        challenges = generate_challenges(json_output)

        if challenges:
            # Store the challenges in the UserChallenges table
            store_challenges(conn, user_id, challenges)
            
            logging.info("Generated Challenges:")
            for idx, challenge in enumerate(challenges, start=1):
                logging.info(f"Challenge {idx}: {challenge}")
            return jsonify({"challenges": challenges}), 200
        else:
            logging.error("No challenges were generated.")
            return jsonify({"error": "No challenges generated"}), 500
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

if __name__ == "__main__":
    app.run(debug=True, port=5002)