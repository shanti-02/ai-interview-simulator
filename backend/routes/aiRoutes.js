// backend/routes/aiRoutes.js

const express = require("express");
const router = express.Router();

// node-fetch fix
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));


// 🎯 Generate Interview Question
router.post("/question", async (req, res) => {
  console.log("QUESTION API HIT ✅");

  const { role } = req.body;

  try {
    const prompt = `
Generate one professional interview question for a ${role} role.
Only give the question.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("QUESTION RESPONSE:", data);

    const question =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Tell me about yourself.";

    res.json({ question });

  } catch (error) {
    console.error("QUESTION ERROR:", error);

    res.status(500).json({
      error: "Question generation failed",
    });
  }
});


// 🎯 Analyze User Answer
router.post("/analyze", async (req, res) => {
  console.log("ANALYZE API HIT ✅");

  const { answer, role } = req.body;

  try {
    const prompt = `
You are a professional interviewer.

Job Role: ${role}

Candidate Answer:
"${answer}"

Evaluate the answer professionally.

Give output in this format:

Score: __/10

Strengths:
- point 1
- point 2

Weaknesses:
- point 1
- point 2

Suggestions:
- point 1
- point 2
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("AI RESPONSE:", data);

    const feedback =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No feedback generated";

    res.json({ feedback });

  } catch (error) {
    console.error("ANALYZE ERROR:", error);

    res.status(500).json({
      error: "AI analysis failed",
    });
  }
});

module.exports = router;