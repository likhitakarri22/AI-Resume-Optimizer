# AI Resume Optimizer

An AI-powered web application that analyzes resumes against job descriptions using **Google Gemini AI**. The application evaluates ATS compatibility by comparing skills, qualifications, and experience, then generates an ATS score along with personalized feedback to help users improve their resumes.

## 🌐 Live Demo

**Frontend:** https://ai-resume-optimizer-azure.vercel.app/

**Backend API:** https://ai-resume-optimizer-dqf3.onrender.com/

---

## ✨ Features

- Upload resumes in PDF format
- Enter a job description as text
- Upload a job description as an image
- AI-powered resume analysis using Google Gemini AI
- ATS Compatibility Score
- Matching Skills Analysis
- Missing Skills Detection
- Resume Strengths & Weaknesses
- Personalized Improvement Suggestions
- Overall Resume Match Recommendation

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Axios

### Backend
- Python
- FastAPI
- Uvicorn

### AI & Libraries
- Google Gemini 2.5 Flash API
- PyPDF
- python-dotenv
- python-multipart

---

## 📂 Project Structure

```text
AI-Resume-Optimizer/
├── backend/
├── frontend/
└── README.md
```

---

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/likhitakarri22/AI-Resume-Optimizer.git
cd AI-Resume-Optimizer
```

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Create a `.env` file inside the `backend` folder.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---


## 👨‍💻 Author

**Likhita Karri**

- GitHub: https://github.com/likhitakarri22
- LinkedIn: https://www.linkedin.com/in/karri-likhita

---

## 📄 License

This project was developed for educational and portfolio purposes.
