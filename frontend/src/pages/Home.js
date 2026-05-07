import { useState } from "react";

function Home({ setRole, startInterview }) {
  const [input, setInput] = useState("");

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      
      <h1>AI Interview Simulator</h1>

      <input
        type="text"
        placeholder="Enter role (e.g. Java Developer)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: "10px", margin: "10px" }}
      />

      <button
        onClick={() => {
          setRole(input);
          startInterview();
        }}
        style={{ padding: "10px" }}
      >
        Start Interview
      </button>

    </div>
  );
}

export default Home;