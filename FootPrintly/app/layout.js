import "./globals.css";
import Footer from "@/components/footer";

export const metadata = {
  title: "EcoSpark",
  description: "Enhancing Urban Sustainability Through Footprint Tracking and Behavioral Insights",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
