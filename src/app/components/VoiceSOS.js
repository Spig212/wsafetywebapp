"use client";
import { useState, useEffect } from "react";

export default function VoiceSOS() {
  const [listening, setListening] = useState(false);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.log("Speech recognition not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
      console.log("Voice recognition started...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Heard:", transcript);

      if (transcript.includes("help")) {
        setTriggered(true);
        alert("🚨 Emergency SOS Triggered!");
        setTimeout(() => setTriggered(false), 5000); // Reset after 5 seconds
      }
    };

    recognition.start();

    return () => {
      recognition.stop();
      setListening(false);
    };
  }, []);

  return (
    <div className="p-4 text-center">
      <p className={`text-lg font-semibold ${triggered ? "text-red-600" : "text-gray-600"}`}>
        {triggered ? "🚨 SOS Triggered!" : listening ? "🎤 Listening for 'Help'..." : "❌ Voice recognition not active"}
      </p>
    </div>
  );
}
