from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from google import genai
from google.genai import types

import os
import json
import re
import pandas as pd
import time
import math


# ENV + APP SETUP  

load_dotenv()   # Loads environment variables and initializes FastAPI app

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found")

client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_NAME = "gemini-3-flash-preview"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"  #Directory to store uploaded files
os.makedirs(UPLOAD_DIR, exist_ok=True)


# PDF / IMAGE PROMPT

PDF_PROMPT = """   
You are reading an INVOICE IMAGE or PDF.

STRICT RULES:
- Extract ALL line items
- Product name must NEVER be empty
- Quantity defaults to 1 if missing
- Extract tax and total correctly
- Phone number may appear as MOBILE, PHONE, CONTACT

OUTPUT ONLY VALID JSON:

{
  "invoices": [{
    "serialNumber": string,
    "date": string | null,
    "customerName": string | null,
    "productName": string,
    "quantity": number,
    "tax": number,
    "totalAmount": number
  }],
  "products": [{
    "name": string,
    "quantity": number,
    "unitPrice": number,
    "tax": number,
    "priceWithTax": number
  }],
  "customers": [{
    "name": string,
    "phone": string | null,
    "totalPurchaseAmount": number
  }]
}

JSON ONLY. NO EXPLANATION.
"""



def safe_number(v):     #Safely converts anything (string, int, float, None) into a valid float
    try:
        if isinstance(v, str):
            v = v.replace(",", "")
        n = float(v)
        if math.isnan(n) or math.isinf(n):
            return 0.0
        return n
    except:
        return 0.0


def extract_json(text: str):  #Extracts valid JSON from Gemini’s text response
    try:
        return json.loads(text)
    except Exception:
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            raise ValueError("No JSON found")
        return json.loads(match.group())


def extract_phone(text: str):     #Finds an Indian mobile number in raw text
    m = re.search(r"\b[6-9]\d{9}\b", text)
    return m.group() if m else None


def deep_clean_numbers(obj):   #Recursively removes NaN / Infinity from nested structures
    
    """Remove NaN / Infinity so JSON never crashes"""
    if isinstance(obj, dict):
        return {k: deep_clean_numbers(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [deep_clean_numbers(i) for i in obj]
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return 0.0
    return obj





# PDF / IMAGE (GEMINI)


def extract_from_pdf(file_bytes: bytes, mime_type: str):  #Extracts invoice data from PDF / Image using Gemini AI  (AI brain of your system)
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=[
            types.Part.from_bytes(data=file_bytes, mime_type=mime_type),
            PDF_PROMPT
        ],
        config={"temperature": 0.1}
    )

    data = extract_json(response.text)

    phone = extract_phone(response.text)
    if phone:
        for c in data.get("customers", []):
            if not c.get("phone"):
                c["phone"] = phone

    return normalize_response(data)

# NORMALIZE FOR UI

def normalize_response(data: dict):        # Normalizes and fills missing data in the extracted invoice data
    invoices = data.get("invoices") or []
    products = data.get("products") or []
    customers = data.get("customers") or []

    # Derive products if missing
    if invoices and not products:
        pmap = {}
        for i in invoices:
            name = i.get("productName") or "Invoice Item"
            pmap.setdefault(name, {
                "name": name,
                "quantity": 0,
                "unitPrice": 0,
                "tax": i.get("tax", 0),
                "priceWithTax": 0
            })
            pmap[name]["quantity"] += i.get("quantity", 1)
            pmap[name]["priceWithTax"] += i.get("totalAmount", 0)
        products = list(pmap.values())

    # Derive customers if missing
    if invoices and not customers:
        cmap = {}
        for i in invoices:
            cname = i.get("customerName") or "Customer"
            cmap.setdefault(cname, {
                "name": cname,
                "phone": None,
                "totalPurchaseAmount": 0
            })
            cmap[cname]["totalPurchaseAmount"] += i.get("totalAmount", 0)
        customers = list(cmap.values())

    return deep_clean_numbers({
        "invoices": invoices,
        "products": products,
        "customers": customers
    })

# EXCEL (NOt used AI,FAST)

def parse_excel(file_path: str):    #Parses Excel file and returns list of rows as dictionaries
    df = pd.read_excel(file_path)
    rows = df.to_dict(orient="records")
    print("🧾 Excel Headers:", list(rows[0].keys()) if rows else [])
    return rows


def map_excel_to_schema(rows: list):  #Maps parsed Excel rows to the standard invoice schema
    invoices = []
    customers = {}

    for r in rows: #Iterate through each row in the Excel data
        cname = r.get("Party Name") or r.get("Customer Name") 
        total = safe_number(r.get("Total Amount") or r.get("Net Amount"))

        invoices.append({
            "serialNumber": r.get("Serial Number"),
            "date": r.get("Date"),
            "customerName": cname,
            "productName": "Invoice Total",
            "quantity": 1,
            "tax": safe_number(r.get("Tax Amount")),
            "totalAmount": total
        })

        if cname:
            customers.setdefault(cname, {
                "name": cname,
                "phone": None,
                "totalPurchaseAmount": 0
            })
            customers[cname]["totalPurchaseAmount"] += total

    return deep_clean_numbers({
        "invoices": invoices,
        "products": [],
        "customers": list(customers.values())
    })



# API ROUTE


@app.post("/api/extract")     #API endpoint to extract invoice data from uploaded file (PDF, Image, Excel)
async def extract_invoice(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as f:
            f.write(await file.read())

        # EXCEL 
        if file.filename.lower().endswith((".xlsx", ".xls")):
            rows = parse_excel(file_path)
            return map_excel_to_schema(rows)

        #  PDF / IMAGE 
        with open(file_path, "rb") as f:
            file_bytes = f.read()

        return extract_from_pdf(file_bytes, file.content_type)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
