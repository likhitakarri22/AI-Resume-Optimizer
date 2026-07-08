import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jdImage, setJdImage] = useState(null);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [rewrittenResume, setRewrittenResume] = useState("");
  const [rewriting, setRewriting] = useState(false);

  const handleUpload = async () => {

    if (!resume) {
      alert("Upload Resume");
      return;
    }

    if (!jobDescription && !jdImage) {
      alert("Paste JD or Upload Screenshot");
      return;
    }

    const formData = new FormData();

    formData.append("file", resume);

    if (jobDescription)
      formData.append("job_description", jobDescription);

    if (jdImage)
      formData.append("jd_image", jdImage);

    setLoading(true);

    try {

      const response = await axios.post(
        "https://ai-resume-optimizer-dqf3.onrender.com/upload",
        formData
      );

      setResult(response.data);

    } catch (err) {

      console.log(err);
      alert("Something went wrong");

    }

    setLoading(false);

  };

  const handleRewrite = async () => {

    if (!resume) {
      alert("Upload Resume First");
      return;
    }

    const formData = new FormData();

    formData.append("file", resume);

    setRewriting(true);

    try {

      const response = await axios.post(
        "https://ai-resume-optimizer-dqf3.onrender.com/rewrite",
        formData
      );

      setRewrittenResume(response.data.resume);

    } catch (err) {

      console.log(err);
      alert("Rewrite Failed");

    }

    setRewriting(false);

  };

  return (

        <div className="container">

      <h1>AI Resume Optimizer</h1>

      <p className="subtitle">
        Upload Resume and Compare with Job Description
      </p>

      <h3>📄 Upload Resume (PDF)</h3>

      <input
        type="file"
        accept=".pdf"
        onChange={(e)=>setResume(e.target.files[0])}
      />

      <h3>📝 Paste Job Description</h3>

      <textarea
        placeholder="Paste Job Description..."
        value={jobDescription}
        onChange={(e)=>setJobDescription(e.target.value)}
      />

      <h3>OR</h3>

      <h3>🖼 Upload Job Description Screenshot</h3>

      <input
        type="file"
        accept="image/*"
        onChange={(e)=>setJdImage(e.target.files[0])}
      />

      <button onClick={handleUpload}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      <button
  onClick={handleRewrite}
  style={{ marginTop: "15px", background: "#16a34a" }}
  disabled={rewriting}
>
  {rewriting ? "⏳ Optimizing Resume..." : "✨ Improve Resume"}
</button>

{rewriting && (
  <div className="loading-box">
    <h3>✨ Optimizing your resume...</h3>
    <p>This usually takes 10–20 seconds.</p>
  </div>
)}

      {result && (

        <div className="dashboard">

          <div className="score-card">

            <h2>ATS Score</h2>

            <h1>{result.score}%</h1>

            <div className="progress">
              <div
                className="progress-fill"
                style={{width:`${result.score}%`}}
              ></div>
            </div>

          </div>

          <div className="card">

            <h2>✅ Matching Skills</h2>

            <ul>
              {result.matching_skills.map((item,index)=>(
                <li key={index}>{item}</li>
              ))}
            </ul>

          </div>

          <div className="card">

            <h2>❌ Missing Skills</h2>

            <ul>
              {result.missing_skills.map((item,index)=>(
                <li key={index}>{item}</li>
              ))}
            </ul>

          </div>

          <div className="card">

            <h2>💪 Strengths</h2>

            <ul>
              {result.strengths.map((item,index)=>(
                <li key={index}>{item}</li>
              ))}
            </ul>

          </div>

          <div className="card">

            <h2>⚠ Weaknesses</h2>

            <ul>
              {result.weaknesses.map((item,index)=>(
                <li key={index}>{item}</li>
              ))}
            </ul>

          </div>

          <div className="card">

            <h2>💡 Suggestions</h2>

            <ul>
              {result.suggestions.map((item,index)=>(
                <li key={index}>{item}</li>
              ))}
            </ul>

          </div>

          <div className="recommendation">

            <h2>🎯 {result.recommendation}</h2>

          </div>

        </div>

      )}
                  {rewrittenResume && (

        <div className="card">

          <h2>✨ ATS-Optimized Resume</h2>

          <textarea
            value={rewrittenResume}
            readOnly
            rows={25}
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "15px",
              fontSize: "15px"
            }}
          />

        </div>

      )}

      <footer className="footer">
        © 2026 AI Resume Optimizer | Powered by React • FastAPI • Gemini AI
      </footer>

    </div>

  );

}

export default App;