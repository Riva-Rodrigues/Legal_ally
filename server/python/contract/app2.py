import os
import streamlit as st
import PyPDF2
import google.generativeai as genai
import pandas as pd
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Check if API key is loaded
if not GOOGLE_API_KEY:
    st.error("API key is missing. Please check your .env file.")
    st.stop()

# Configure Google Gemini API
genai.configure(api_key=GOOGLE_API_KEY)

# Gemini Model Name
MODEL_NAME = "gemini-pro"

# Load GDPR guidelines from CSV
@st.cache_data
def load_gdpr_guidelines(csv_filename):
    try:
        df = pd.read_csv(csv_filename)
        first_column = df.columns[0]  # Assuming the first column contains guidelines
        gdpr_guidelines = "\n".join(df[first_column].astype(str))
        return gdpr_guidelines
    except Exception as e:
        st.error(f"Error loading GDPR guidelines: {e}")
        return ""

# Function to call Gemini API for legal clause extraction
@st.cache_data
def parse_with_gemini(dom_chunks):
    model = genai.GenerativeModel(MODEL_NAME)
    parsed_results = []
    for i, chunk in enumerate(dom_chunks, start=1):
        prompt = f"""
        You are a legal expert. Extract all legal clauses from the following contract text, categorize the high-risk ones, and suggest changes. 
        Provide the output in a concise tabular format.

        Contract Text:
        {chunk}

        Expected Output:
        | Clause | Risk Level | Suggested Changes |
        |--------|------------|-------------------|
        """
        response = model.generate_content(prompt)
        parsed_results.append(response.text)
    return "\n".join(parsed_results)

# Function to call Gemini API for GDPR compliance check
@st.cache_data
def check_gdpr_compliance(dom_chunks, gdpr_guidelines):
    model = genai.GenerativeModel(MODEL_NAME)
    compliance_results = []
    for i, chunk in enumerate(dom_chunks, start=1):
        prompt = f"""
        You are a GDPR compliance expert. Given the following GDPR guidelines and the contract text, analyze whether the contract complies with GDPR. 
        Highlight any non-compliant clauses and suggest modifications.

        GDPR Guidelines:
        {gdpr_guidelines}

        Contract Text:
        {chunk}
        """
        response = model.generate_content(prompt)
        compliance_results.append(response.text)
    return "\n".join(compliance_results)

# Extract text from uploaded PDF
def extract_text_from_pdf(uploaded_pdf):
    pdf_reader = PyPDF2.PdfReader(uploaded_pdf)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() or ""
    return text

# Streamlit App
def app():
    st.title("Legal Contract Analyzer & GDPR Compliance Checker")

    # Load GDPR guidelines
    csv_filename = "gdpr_qa_train.csv"
    if not os.path.exists(csv_filename):
        st.error("GDPR guidelines CSV file not found. Please ensure it is in the same directory as app.py.")
        st.stop()
    gdpr_guidelines = load_gdpr_guidelines(csv_filename)

    # File upload for PDF contract
    uploaded_file = st.file_uploader("Upload a legal contract (PDF)", type="pdf")
    
    if uploaded_file is not None:
        st.write("File uploaded successfully!")
        contract_text = extract_text_from_pdf(uploaded_file)
        st.text_area("Extracted Contract Text", contract_text, height=300)
        dom_chunks = [contract_text[i:i+2000] for i in range(0, len(contract_text), 2000)]
        
        # Buttons for Gemini API calls
        if st.button("Analyze Legal Clauses"):
            st.subheader("Legal Clause Analysis")
            clause_analysis = parse_with_gemini(dom_chunks)
            st.write("Extracted Clauses & Risk Analysis", clause_analysis)
        
        if st.button("Check GDPR Compliance"):
            st.subheader("GDPR Compliance Report")
            compliance_output = check_gdpr_compliance(dom_chunks, gdpr_guidelines)
            st.write("Compliance Analysis", compliance_output, height=400)

if __name__ == "__main__":
    app()
