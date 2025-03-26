"use client";
import { useState, useRef } from "react";

export default function FakeCall() {
  const [isRinging, setIsRinging] = useState(false);
  const [isOnCall, setIsOnCall] = useState(false);
  const ringtoneRef = useRef(null);
  const voiceRef = useRef(null);

  const startFakeCall = () => {
    setIsRinging(true);
    ringtoneRef.current.play(); // Play ringtone
  };

  const answerCall = () => {
    ringtoneRef.current.pause();
    ringtoneRef.current.currentTime = 0;
    setIsRinging(false);
    setIsOnCall(true);
    voiceRef.current.play(); // Play fake conversation
  };

  const endCall = () => {
    setIsOnCall(false);
    voiceRef.current.pause();
    voiceRef.current.currentTime = 0;
  };

  const declineCall = () => {
    ringtoneRef.current.pause();
    ringtoneRef.current.currentTime = 0;
    setIsRinging(false);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={startFakeCall}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Trigger Fake Call 📞
      </button>

      {/* Incoming Call UI */}
      {isRinging && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white">
          <h2 className="text-2xl mb-4">📞 Incoming Call</h2>
          <p className="text-lg">Mom</p>

          <div className="flex mt-6 space-x-4">
            <button
              onClick={answerCall}
              className="px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition"
            >
              Answer ✅
            </button>
            <button
              onClick={declineCall}
              className="px-6 py-3 bg-red-500 rounded-lg hover:bg-red-600 transition"
            >
              Decline ❌
            </button>
          </div>
        </div>
      )}

      {/* On-Call UI */}
      {isOnCall && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white">
          <h2 className="text-2xl mb-4">📱 On Call with Mom...</h2>
          <button
            onClick={endCall}
            className="px-6 py-3 bg-red-500 rounded-lg hover:bg-red-600 transition"
          >
            End Call ⛔
          </button>
        </div>
      )}

      <audio ref={ringtoneRef} src="/ringtone.mp3" loop></audio>
      <audio ref={voiceRef} src="/fake-voice.mp3"></audio>
    </div>
  );
}
