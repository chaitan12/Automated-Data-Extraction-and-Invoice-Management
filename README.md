# Automated-Data-Extraction-and-Invoice-Management

👉Project Objective

The goal of this project is to extract Invoice, Product, and Customer details and update them in their respective tabs using a generic AI-based solution.

If any required information is missing from the uploaded file (which is true for some test cases), the system must:

Handle the case safely without crashing

Highlight missing information in the application

Still return a valid and usable response

👉Supported File Types

This application supports three invoice formats:

Excel files (.xls, .xlsx)
Processed using rule-based parsing for speed and accuracy.

PDF files
Processed using AI-based document understanding.

Image files (.jpg, .png)
Processed using AI-based OCR and semantic extraction.

👉 System Design

The system follows a hybrid extraction approach:

Structured files (Excel) are handled without AI to avoid latency and hallucinations.

Unstructured files (PDF and Images) are processed using an AI vision model.

All outputs are normalized into a single consistent JSON schema so the frontend never breaks.

👉 Unified Output Structure

Every upload returns data in the same format:

invoices

products

customers

This guarantees that:

All UI tabs always render

No conditional frontend logic is required

Missing data never causes runtime errors

🧾 Invoice Data

The invoice section extracts:

Invoice number

Date

Customer name

Product or service name

Quantity

Tax

Total amount

If any of these fields are missing:

Quantity defaults to 1

Tax defaults to 0

Product name is inferred or replaced with a fallback value

👉Product Data

The product section shows:

Product name

Total quantity

Unit price

Tax

Price including tax

If product-level data is not present:

Products are derived from invoice totals

Quantities and prices are aggregated automatically

👤 Customer Data

The customer section includes:

Customer name

Phone number

Total purchase amount

Phone numbers are extracted from:

Mobile

Phone

Contact

Numeric fallback detection

If the phone number is missing, it is displayed clearly as unavailable.

👉 Missing Data Handling

This project is built to support incomplete invoices.

When data is missing:

Product names are replaced with a safe fallback

Quantity defaults to 1

Tax defaults to 0

Phone numbers are shown as missing

Customer names fall back to a generic label

Missing values are explicitly visible in the UI, fulfilling the requirement to highlight missing information.

🛡️ Reliability and Error Handling

The system ensures:

No NaN or Infinity values in API responses

JSON-safe output at all times

Graceful handling of AI failures

Stable responses even for poorly structured invoices

🧪 Test Case Coverage

The system successfully handles:

Fully structured Excel invoices

Excel files without product breakdowns

Summary-only invoices

Clear PDFs and images

Invoices with missing phone numbers

Invoices with missing tax or quantity

Mixed and inconsistent formats

The goal is not perfection, but maximum successful extraction across real-world cases.

🚀 Technology Stack

Backend:

FastAPI

Pandas

Google Gemini Vision API

Python

Frontend:

React

Tab-based UI for Invoices, Products, and Customers

Clear indicators for missing data

 Why This Is a Generic AI-Based Solution

AI is used only where structure is missing

Deterministic logic is used where data is structured

Works across multiple invoice layouts

Easily extendable to new formats

Produces consistent output for the UI

🏁 Conclusion

Swipe Invoice Automation is a robust and scalable solution that:

Extracts invoice data from Excel, PDF, and images

Uses AI intelligently and responsibly

Handles missing data gracefully

Highlights incomplete information clearly

Solves as many real-world cases as possible

This makes the system production-ready and reliable.
