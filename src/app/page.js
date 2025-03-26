

import WearableBLE from "./components/WearableBLE";  // Adjust based on `page.js` location

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import VoiceSOS from "./components/VoiceSOS";
import ShakeSOS from "./components/ShakeSOS";  // ✅ Import Shake Detection
import FakeCall from "./components/FakeCall";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[radial-gradient(circle,rgba(151,105,197,1)_0%,rgba(231,213,246,1)_100%)] p-6">
        <Hero />
        <VoiceSOS />
        <WearableBLE />
        <FakeCall />
        <ShakeSOS />   {/* ✅ Activate Shake Detection */}
      </div>
    </>
  );
}



