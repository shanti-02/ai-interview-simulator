import { useState } from "react";

function VoiceRecorder({ setTranscript }) {
  const [listening, setListening] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  // ❗ Check if supported
  if (!SpeechRecognition) {
    return <p>Your browser does not support voice recognition</p>;
  }

  const recognition = new SpeechRecognition();

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    setTranscript(text);
    setListening(false);
  };

  const startListening = () => {
    setListening(true);
    recognition.start();
  };

  return (
    <div>
      <button onClick={startListening}>
        {listening ? "Listening..." : "Start Speaking"}
      </button>
    </div>
  );
}

export default VoiceRecorder;