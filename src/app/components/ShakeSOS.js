"use client";
import { useEffect, useState } from "react";

export default function ShakeSOS() {
  const [message, setMessage] = useState("📳 Shake detection active...");

  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let shakeThreshold = 15; // Adjust sensitivity (Lower = More Sensitive)

    const handleMotion = (event) => {
      const { x, y, z } = event.accelerationIncludingGravity || {};

      if (!x || !y || !z) return;

      let deltaX = Math.abs(x - lastX);
      let deltaY = Math.abs(y - lastY);
      let deltaZ = Math.abs(z - lastZ);

      if (deltaX + deltaY + deltaZ > shakeThreshold) {
        setMessage("🚨 SOS Triggered by Shake!");
        console.log("Shake detected! Sending SOS...");
        // Add emergency action here (e.g., send message, call, etc.)
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, []);

  return (
    <div className="text-center p-4">
      <h2 className="text-lg font-bold">{message}</h2>
    </div>
  );
}
