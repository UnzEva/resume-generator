from fastapi import FastAPI, UploadFile, File, Form
from typing import Optional
import json
import os
from io import BytesIO

from dotenv import load_dotenv
from pypdf import PdfReader
from docx import Document
from striprtf.striprtf import rtf_to_text
from google import genai
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(file_bytes))
    text_parts = []

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)

    return "\n".join(text_parts)


def extract_text_from_docx(file_bytes: bytes) -> str:
    doc = Document(BytesIO(file_bytes))
    text_parts = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(text_parts)


def extract_text_from_txt(file_bytes: bytes) -> str:
    return file_bytes.decode("utf-8", errors="ignore")


def extract_text_from_rtf(file_bytes: bytes) -> str:
    raw_text = file_bytes.decode("utf-8", errors="ignore")
    return rtf_to_text(raw_text)


def extract_text(file: UploadFile, file_bytes: bytes) -> str:
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)

    if filename.endswith(".docx"):
        return extract_text_from_docx(file_bytes)

    if filename.endswith(".txt"):
        return extract_text_from_txt(file_bytes)

    if filename.endswith(".rtf"):
        return extract_text_from_rtf(file_bytes)

    if filename.endswith(".doc"):
        return ""

    return ""


def build_prompt(resume_text: str, vacancy: str, options: dict) -> str:
    instructions = []

    if options.get("highlightSkills", False):
        instructions.append(
            "Create a clear Technical Skills section and emphasize the skills most relevant to the vacancy."
        )
    else:
        instructions.append(
            "Do not over-emphasize a separate Technical Skills section unless it is naturally justified by the resume."
        )

    if options.get("optimizeATS", False):
        instructions.append(
            "Optimize the resume for ATS by using clear section headings, standard phrasing, and relevant keywords from the vacancy."
        )
    else:
        instructions.append(
            "Do not explicitly optimize for ATS beyond normal professional clarity."
        )

    if options.get("addSummary", False):
        instructions.append(
            "Include a Professional Summary section tailored to the vacancy."
        )
    else:
        instructions.append(
            "Do not include a Professional Summary section."
        )

    if options.get("addTemperature", False):
        instructions.append(
            "Use slightly stronger, more confident wording while remaining truthful and professional."
        )
    else:
        instructions.append(
            "Keep the tone neutral and professional."
        )

    joined_instructions = "\n".join(f"- {item}" for item in instructions)

    return f"""
You are a resume optimization assistant.

Task:
Rewrite and tailor the candidate's resume for the target vacancy.

Core rules:
- Keep the output professional and ATS-friendly when requested.
- Do not invent experience, education, tools, or achievements that are not supported by the original resume.
- Improve wording, structure, and relevance.
- Focus on aligning existing experience with the vacancy.
- Return plain text only.
- Use these sections only if appropriate:
  1. Professional Summary
  2. Technical Skills
  3. Professional Experience
  4. Projects
  5. Education

Specific instructions:
{joined_instructions}

Target Vacancy:
{vacancy}

Original Resume Text:
{resume_text}
""".strip()


@app.post("/generate")
async def generate_resume(
    file: Optional[UploadFile] = File(None),
    vacancy: str = Form(...),
    options: str = Form(...),
):
    parsed_options = json.loads(options)

    filename = file.filename if file else None
    extracted_text = ""

    if file and file.filename:
        file_bytes = await file.read()
        extracted_text = extract_text(file, file_bytes)

        if file.filename.lower().endswith(".doc"):
            return {
                "fileName": filename,
                "generatedResume": "Old .doc files are not supported yet. Please convert the file to .docx, .pdf, .rtf, or .txt.",
            }

    if not extracted_text:
        return {
            "fileName": filename,
            "generatedResume": "Could not extract text from the uploaded file.",
        }

    prompt = build_prompt(extracted_text, vacancy, parsed_options)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
        )
        generated_resume = response.text if response.text else "No response from Gemini."
    except Exception as e:
        generated_resume = f"Gemini error: {str(e)}"

    return {
        "fileName": filename,
        "generatedResume": generated_resume,
    }
