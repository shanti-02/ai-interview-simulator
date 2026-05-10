// frontend/src/components/Interview.js

import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function Interview() {
  const [role, setRole] = useState("Frontend Developer");
  const [feedback, setFeedback] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setTypedAnswer(transcript);
    }
  }, [transcript]);

  const generateQuestion = async () => {
    setLoading(true);
    setFeedback("");
    setQuestion("");

    try {
      const res = await fetch("https://ai-interview-simulator-40q0.onrender.com/api/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      setQuestion(data.question);
    } catch (error) {
      console.error("QUESTION ERROR:", error);
      setQuestion("Something went wrong while generating question.");
    }

    setLoading(false);
  };

  const sendAnswer = async () => {
    console.log("BUTTON CLICKED ✅");

    const finalAnswer = typedAnswer.trim() || transcript.trim();

    if (!finalAnswer) {
      alert("Please type or speak your answer first.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://ai-interview-simulator-40q0.onrender.com/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer: finalAnswer,
          role,
        }),
      });

      const data = await res.json();

      console.log("AI DATA:", data);

      setFeedback(data.feedback || data.error || "No feedback generated.");
    } catch (error) {
      console.error("ANSWER ERROR:", error);
      setFeedback("Something went wrong while evaluating answer.");
    }

    setLoading(false);
  };

  const resetAll = () => {
    resetTranscript();
    setTypedAnswer("");
    setFeedback("");
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🎤 AI Interview Simulator</h1>

      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Enter Job Role"
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
        }}
      />

      <br />

      <button
        onClick={generateQuestion}
        disabled={loading}
        style={{
          padding: "10px 20px",
          marginRight: "10px",
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Question"}
      </button>

      <button
        onClick={SpeechRecognition.startListening}
        disabled={loading}
        style={{
          padding: "10px 20px",
          marginRight: "10px",
          cursor: "pointer",
        }}
      >
        Start Voice
      </button>

      <button
        onClick={SpeechRecognition.stopListening}
        disabled={loading}
        style={{
          padding: "10px 20px",
          marginRight: "10px",
          cursor: "pointer",
        }}
      >
        Stop Voice
      </button>

      <button
        onClick={resetAll}
        disabled={loading}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Reset
      </button>

      <br />
      <br />

      {loading && (
        <h3 style={{ color: "#2563eb" }}>
          ⏳ AI is processing your request...
        </h3>
      )}

      <div
        style={{
          background: "#f1f1f1",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h2>🧠 Interview Question:</h2>
        <p>{question}</p>
      </div>

      <div
        style={{
          background: "#e8f5e9",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>🎙 Your Answer:</h2>

        <textarea
          value={typedAnswer}
          onChange={(e) => setTypedAnswer(e.target.value)}
          placeholder="Type your answer here or use voice..."
          rows="6"
          style={{
            width: "100%",
            maxWidth: "700px",
            padding: "15px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #aaa",
            resize: "vertical",
          }}
        />

        <p>
          <strong>Current Answer:</strong> {typedAnswer}
        </p>
      </div>

      <br />

      <button
        onClick={sendAnswer}
        disabled={loading}
        style={{
          padding: "12px 25px",
          background: loading ? "gray" : "black",
          color: "white",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          borderRadius: "5px",
          fontWeight: "bold",
        }}
      >
        {loading ? "Analyzing..." : "Submit Answer"}
      </button>

      <br />
      <br />

      <div
        style={{
          background: "#fff3cd",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>🤖 AI Feedback:</h2>
        <p style={{ whiteSpace: "pre-wrap" }}>{feedback}</p>
      </div>
    </div>
  );
}

export default Interview;