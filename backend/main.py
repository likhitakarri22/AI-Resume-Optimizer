from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from dotenv import load_dotenv
from google import genai
from google.genai import types
import tempfile
import json
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://ai-resume-optimizer-azure.vercel.app"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Backend is working!"}


def extract_jd_from_image(image_path):

    with open(image_path, "rb") as f:
        image_bytes = f.read()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            "Extract ONLY the complete job description from this image. Return plain text only.",
            types.Part.from_bytes(
                data=image_bytes,
                mime_type="image/png",
            ),
        ],
    )

    return response.text


@app.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(""),
    jd_image: UploadFile = File(None),
):

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(await file.read())
        resume_path = temp_file.name

    reader = PdfReader(resume_path)

    resume_text = ""

    for page in reader.pages:
        text = page.extract_text()

        if text:
            resume_text += text

    if jd_image is not None:

        extension = os.path.splitext(jd_image.filename)[1]

        if extension == "":
            extension = ".png"

        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as img:

            img.write(await jd_image.read())

            image_path = img.name

        job_description = extract_jd_from_image(image_path)

    prompt = f"""
You are an expert ATS (Applicant Tracking System).

Compare the Resume with the Job Description.

Resume:

{resume_text}

Job Description:

{job_description}

Return ONLY valid JSON.

Format:

{{
"score":85,
"matching_skills":["Python","React"],
"missing_skills":["Docker","AWS"],
"strengths":["Point 1","Point 2"],
"weaknesses":["Point 1","Point 2"],
"suggestions":["Suggestion 1","Suggestion 2"],
"recommendation":"Good Match"
}}

Return ONLY JSON.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    try:

        analysis = json.loads(response.text)

    except Exception:

        analysis = {
            "score":0,
            "matching_skills":[],
            "missing_skills":[],
            "strengths":[],
            "weaknesses":[],
            "suggestions":[response.text],
            "recommendation":"Unable to Parse"
        }

    return analysis


@app.post("/rewrite")
async def rewrite_resume(
    file: UploadFile = File(...)
):

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:

        temp_file.write(await file.read())

        resume_path = temp_file.name

    reader = PdfReader(resume_path)

    resume_text = ""

    for page in reader.pages:

        text = page.extract_text()

        if text:

            resume_text += text

    prompt = f"""
You are a professional ATS Resume Writer.

Rewrite the following resume.

Rules:

Return ONLY plain text.

Do NOT use Markdown.

Do NOT use **, ##, ---, or backticks.

Use section headings in CAPITAL LETTERS.

Use • for bullet points.

Keep proper spacing.

Never invent experience.

Never invent projects.

Never invent certifications.

Improve grammar.

Improve ATS keywords.

Rewrite weak bullet points.

Return a resume that is ready to copy directly into Microsoft Word.

Resume:

{resume_text}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return {
        "resume": response.text
    }