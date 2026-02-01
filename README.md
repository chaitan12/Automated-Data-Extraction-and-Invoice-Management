# Automated-Data-Extraction-and-Invoice-Management

Swipe Invoice Automation is a generic AI-powered system designed to extract structured Invoice, Product, and Customer information from uploaded files such as Excel, PDF, and Image invoices. The extracted data is automatically organized and displayed across dedicated tabs in the application UI.

The solution is built to handle real-world invoice inconsistencies, missing fields, and varying file formats while maximizing successful extraction across different test cases.

#Objective

The primary goal of this project is to:

Extract Invoice details
Extract Product details
Extract Customer details

and populate them into their respective tabs in the application interface using a generic AI-based solution.

If any required information is missing from the uploaded file, the system must still process the file and clearly highlight missing data instead of failing.

#Supported File Types

The application supports the following input formats:

Excel files (.xlsx, .xls)
PDF invoices
Invoice images (.jpg, .png, etc.)

Each format is processed using the most reliable approach for that file type.

How the System Works
Excel Files

Excel files are processed locally without AI to ensure speed, reliability, and accuracy.

The system:

Detects available column headers dynamically

Maps invoice-level data such as serial number, date, tax, and total amount

Groups customers correctly even if products are missing

Safely handles missing product data by assigning a default placeholder

Prevents crashes caused by invalid or missing numeric values

If product-level information is not present in the Excel file, the system still creates valid invoices and customers while clearly indicating that product details are unavailable.

PDF and Image Files

PDFs and images are processed using an AI-based extraction pipeline.

The AI:

Reads invoice text and layout

Extracts invoice numbers, dates, totals, and tax

Identifies line items and quantities

Detects customer names and phone numbers (even when labeled as MOBILE, PHONE, CONTACT, etc.)

Infers missing product names when possible

If certain fields cannot be reliably extracted, the system still returns partial data and marks missing fields clearly.

Application UI Behavior

The application displays extracted data across three tabs:

Invoices Tab

Shows all extracted invoice entries with:

Serial number

Customer name

Product or service name

Quantity

Tax

Total amount

Date

Missing fields are shown as empty or default values instead of breaking the UI.

Products Tab

Displays aggregated product information when available:

Product name

Total quantity

Unit price (if available)

Tax

Price with tax

If product data is missing from the source file, the UI clearly indicates that no product details are available.

Customers Tab

Shows customer-level information:

Customer name

Phone number (if available)

Total purchase amount

When phone numbers are missing or unreadable, they are displayed as unavailable instead of incorrect values.

Handling Missing or Incomplete Data

This project is designed to handle incomplete invoices gracefully.

Examples of supported scenarios:

Excel files without product columns

Invoices without phone numbers

PDFs with unclear line items

Images with partial text visibility

In all such cases:

The system continues processing

Partial data is still displayed

Missing fields are highlighted instead of causing failures

Error Handling and Stability

The backend includes multiple safety mechanisms:

Numeric sanitization to prevent JSON serialization errors

Protection against NaN and infinite values

Safe defaults for missing fields

Controlled retries for AI calls

Clear error messages when files cannot be processed

The goal is to maximize successful extraction rather than reject files.

Technology Stack

Frontend:

Modern UI with tab-based navigation

Visual feedback for missing data

Backend:

FastAPI

Pandas for Excel processing

Google Gemini for AI-based extraction

Robust normalization and validation logic

Key Strengths

Generic solution that works across multiple invoice formats
Graceful handling of missing or inconsistent data
Clear separation of Invoice, Product, and Customer information
Fast Excel processing without AI dependency
AI-powered extraction for complex PDFs and images
Stable JSON output suitable for UI rendering

Conclusion

Swipe Invoice Automation focuses on solving real-world invoice extraction challenges rather than ideal scenarios. The system prioritizes robustness, clarity, and user experience by ensuring that as many cases as possible are successfully processed, even when information is missing or incomplete.

This makes the solution practical, scalable, and suitable for real business workflows.
