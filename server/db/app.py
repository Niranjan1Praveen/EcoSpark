import os
import re
import json
import logging
import tempfile
import sqlite3
import google.generativeai as genai
import pdfplumber
from dotenv import load_dotenv
import pytesseract
from pdf2image import convert_from_path
from flask import Flask, request, jsonify, render_template, redirect
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Load environment variables
load_dotenv()

app = Flask(__name__)
DATABASE = "Server.db"
JSON_OUTPUT_FILE = "bill_summaries.json"  # File to store JSON data

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS electricity_bills (
                UserID VARCHAR(255),
                name TEXT,
                address TEXT,
                bill_amount TEXT,
                due_date TEXT,
                account_number TEXT,
                billing_period TEXT,
                additional_instructions TEXT,
                cost_fluctuations TEXT,
                peak_usage_hours TEXT,
                monthly_comparison TEXT,
                avg_daily_consumption TEXT,
                energy_efficiency_tips TEXT,
                additional_parameters TEXT,
                current_units_consumed TEXT,
                subsidies_unit TEXT,
                consumption_history TEXT,
                goal_units TEXT,
                FOREIGN KEY (UserID) REFERENCES UsersTable(UserID)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS water_bills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                water_usage TEXT,
                bill_cycle TEXT,
                current_consumption_units TEXT,
                bill_history TEXT,
                current_consumption_days TEXT,
                billing_period TEXT,
                bill_date TEXT,
                account_number TEXT,
                due_date TEXT,
                bill_amount TEXT,
                additional_instructions TEXT,
                cost_fluctuations TEXT,
                monthly_comparison TEXT,
                avg_daily_consumption TEXT,
                water_efficiency_tips TEXT,
                subsidies_unit TEXT,
                challenges TEXT,
                goal_units TEXT
            )
        ''')
        conn.commit()

init_db()

def clean_text(text: str) -> str:
    """Cleans extracted text for better processing."""
    text = re.sub(r'\*\*', '', text)
    text = re.sub(r"\(cid:\d+\)", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"\n+", " ", text)
    return text

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extracts text from a PDF using pdfplumber, with OCR fallback."""
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                page_text = page.extract_text() or ""
                if not page_text.strip():
                    try:
                        images = convert_from_path(pdf_path, first_page=i + 1, last_page=i + 1)
                        if images:
                            page_text = pytesseract.image_to_string(images[0])
                    except Exception as ocr_error:
                        logging.error(f"❌ OCR error on page {i + 1}: {ocr_error}")
                text += page_text + "\n"
    except Exception as e:
        logging.error(f"❌ Error reading PDF: {e}")
    return clean_text(text)

def generate_summary(pdf_text: str, bill_type: str = "electricity") -> dict:
    api_key = os.getenv("GOOGLE_GENAI_API_KEY")
    if not api_key:
        raise ValueError("❌ API key is missing. Please set it in the .env file.")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""
    Extract key details from the following {bill_type} bill:

    {pdf_text}

    Provide the following details in a clear, structured format (e.g., 'Field: Value'). If a field is not found, explicitly state 'Not found' instead of omitting it:
    """

    if bill_type == "electricity":
        prompt += """
        - Name:
        - Address:
        - Bill Amount:
        - Due Date:
        - Account Number:
        - Billing Period:
        - Additional Instructions:
        - Cost Fluctuations:
        - Monthly Comparison:
        - Consumption History: Extract historical electricity usage data in the following exact format:  'Month/Period: X units'.  For example: 'Jan 2025: 500 units, Feb 2025: 450 units'.  Ensure the data is returned in a single line, with each month/period separated by a comma and space. Do not include any additional text, explanations, or deviations from this format. If no data is available, return 'No data available'.
        - Average Daily Consumption:
        - Energy Efficiency Tips:
        - Additional Parameters:
        - Current units consumed:
        - Goal units: (Generate a practical and plausible number of units consumed(kWh) along with the concise reason for the current billing period. Ensure this number is realistic based on the user's historical usage and provides a meaningful challenge. For example, if the previous month's usage was 618 units, suggest a number slightly lower to encourage energy-saving behavior.)
        - Subsidies Unit:
        - Challenges:
        """
    elif bill_type == "water":
        prompt += """
        - Name:
        - Water Usage:
        - Bill Cycle:
        - Current Consumption Units:
        - Current Consumption Days:
        - Bill History: (Extract historical water usage data, e.g., units consumed in previous months or billing cycles, if available. Format as 'Month/Period: X units', e.g., 'Jan 2025: 500 units, Feb 2025: 450 units'. If not found, say 'Not found')
        - Billing Period:
        - Bill Date:
        - Account Number:
        - Due Date:
        - Bill Amount:
        - Additional Instructions:
        - Cost Fluctuations:
        - Monthly Comparison:
        - Average Daily Consumption:
        - Water Efficiency Tips:
        - Subsidies Unit:
        - Goal units: (Generate a practical and plausible number of units consumed(kL) for the current billing period. Ensure this number is realistic based on the user's historical usage and provides a meaningful challenge. For example, if the previous month's usage was 10 units, suggest a number slightly lower to encourage energy-saving behavior.)
        - Challenges:
        """
    else:
        raise ValueError("Invalid bill type. Use 'electricity' or 'water'.")

    try:
        response = model.generate_content(prompt)
        logging.info(f"Gemini AI Response:\n{response.text}")
        summary_text = response.text.strip()

        # Parse the summary into a structured dictionary
        summary_dict = parse_summary_to_dict(summary_text, bill_type)
        return summary_dict
    except Exception as e:
        logging.error(f"❌ Error generating content: {e}")
        return {"error": f"Error generating content: {e}"}

def parse_summary_to_dict(summary_text: str, bill_type: str) -> dict:
    """Parses the AI-generated summary into a structured dictionary."""
    summary_dict = {"bill_type": bill_type, "timestamp": datetime.now().isoformat()}

    # Define expected fields based on bill type
    if bill_type == "electricity":
        fields = [
            "Name", "Address", "Bill Amount", "Due Date", "Account Number", "Billing Period",
            "Additional Instructions", "Cost Fluctuations", "Monthly Comparison",
            "Consumption History", "Average Daily Consumption", "Energy Efficiency Tips",
            "Additional Parameters", "Current units consumed", "Goal units", "Subsidies Unit", "Challenges"
        ]
    elif bill_type == "water":
        fields = [
            "Name", "Water Usage", "Bill Cycle", "Current Consumption Units", "Current Consumption Days",
            "Bill History", "Billing Period", "Bill Date", "Account Number", "Due Date", "Bill Amount",
            "Additional Instructions", "Cost Fluctuations", "Monthly Comparison",
            "Average Daily Consumption", "Water Efficiency Tips", "Subsidies Unit", "Goal units", "Challenges"
        ]

    # Initialize all fields with "Not found"
    for field in fields:
        summary_dict[field.lower().replace(" ", "_")] = "Not found"

    # Parse the summary text
    pattern = r"(?P<field>[A-Za-z\s]+?):\s*(?P<value>.+?(?=\n\s*[-•]|\n\s*$|\Z))"
    matches = re.findall(pattern, summary_text, re.IGNORECASE | re.DOTALL)

    for field, value in matches:
        cleaned_field = field.strip().lower().replace(" ", "_")
        cleaned_value = clean_text(value.strip())
        summary_dict[cleaned_field] = cleaned_value

    return summary_dict

def save_to_json(summary_dict: dict):
    """Saves the summary dictionary to a JSON file, appending to existing data."""
    try:
        # Load existing data if the file exists
        if os.path.exists(JSON_OUTPUT_FILE):
            with open(JSON_OUTPUT_FILE, 'r') as f:
                data = json.load(f)
        else:
            data = []

        # Append the new summary
        data.append(summary_dict)

        # Write back to the file
        with open(JSON_OUTPUT_FILE, 'w') as f:
            json.dump(data, f, indent=4)
        logging.info(f"✅ Summary saved to {JSON_OUTPUT_FILE}")
    except Exception as e:
        logging.error(f"❌ Error saving to JSON: {e}")

def store_bill_details(summary_dict: dict, bill_type: str = "electricity", pdf_text: str = None):
    """Extracts, processes, and stores bill details in the database."""
    if bill_type == "electricity":
        data = {key: summary_dict.get(key, "Not provided") for key in [
            "name", "address", "bill_amount", "due_date", "account_number",
            "billing_period", "additional_instructions", "cost_fluctuations",
            "peak_usage_hours", "monthly_comparison", "avg_daily_consumption",
            "energy_efficiency_tips", "additional_parameters", "current_units_consumed",
            "subsidies_unit", "consumption_history", "goal_units"
        ]}
        data["peak_usage_hours"] = "Not provided"
    elif bill_type == "water":
        data = {key: summary_dict.get(key, "Not provided") for key in [
            "name", "water_usage", "bill_cycle", "current_consumption_units",
            "current_consumption_days", "billing_period", "bill_date", "account_number",
            "due_date", "bill_amount", "additional_instructions", "cost_fluctuations",
            "monthly_comparison", "avg_daily_consumption", "water_efficiency_tips",
            "subsidies_unit", "challenges", "bill_history", "goal_units"
        ]}

    logging.info(f"Extracted Data for DB:\n{data}")

    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            if bill_type == "electricity":
                cursor.execute('''
                    INSERT INTO electricity_bills (
                        name, address, bill_amount, due_date, account_number, 
                        billing_period, additional_instructions, cost_fluctuations, 
                        peak_usage_hours, monthly_comparison, avg_daily_consumption, 
                        energy_efficiency_tips, additional_parameters, current_units_consumed, 
                        subsidies_unit, consumption_history, goal_units
                    ) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    data["name"], data["address"], data["bill_amount"], data["due_date"], 
                    data["account_number"], data["billing_period"], data["additional_instructions"], 
                    data["cost_fluctuations"], data["peak_usage_hours"], data["monthly_comparison"], 
                    data["avg_daily_consumption"], data["energy_efficiency_tips"], 
                    data["additional_parameters"], data["current_units_consumed"], data["subsidies_unit"], 
                    data["consumption_history"], data["goal_units"]
                ))
            elif bill_type == "water":
                cursor.execute('''
                    INSERT INTO water_bills (
                        name, water_usage, bill_cycle, current_consumption_units, 
                        current_consumption_days, billing_period, bill_date, account_number, 
                        due_date, bill_amount, additional_instructions, cost_fluctuations, 
                        monthly_comparison, avg_daily_consumption, water_efficiency_tips, 
                        subsidies_unit, challenges, bill_history, goal_units
                    ) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    data["name"], data["water_usage"], data["bill_cycle"], 
                    data["current_consumption_units"], data["current_consumption_days"], 
                    data["billing_period"], data["bill_date"], data["account_number"], 
                    data["due_date"], data["bill_amount"], data["additional_instructions"], 
                    data["cost_fluctuations"], data["monthly_comparison"], 
                    data["avg_daily_consumption"], data["water_efficiency_tips"], 
                    data["subsidies_unit"], data["challenges"], data["bill_history"], data["goal_units"]
                ))
            conn.commit()
            logging.info(f"✅ {bill_type.capitalize()} bill details successfully saved to the database!")
    except sqlite3.Error as e:
        logging.error(f"❌ Database error while saving {bill_type} bill details: {e}")

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return "No file part in the request", 400

    file = request.files['file']
    if file.filename == '':
        return "No file selected for uploading", 400

    bill_type = request.form.get('bill_type', 'electricity')

    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
        file.save(tmp.name)
        tmp_path = tmp.name

    try:
        pdf_text = extract_text_from_pdf(tmp_path)
        summary_dict = generate_summary(pdf_text, bill_type)
        
        # Save to JSON if no error occurred
        if "error" not in summary_dict:
            save_to_json(summary_dict)
        
        store_bill_details(summary_dict, bill_type, pdf_text)
        return redirect('https://eco-spark-5vta.vercel.app/home')
    except Exception as e:
        logging.error(f"Error processing file: {e}")
        return "An error occurred while processing the file", 500
    finally:
        os.remove(tmp_path)

if __name__ == "__main__":
    app.run(debug=True)