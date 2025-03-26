export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-300 via-pink-400 to-red-400 text-center p-6">
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4">
        💖 Your Personal Wearable Dashboard
      </h1>
      <p className="text-lg text-white/90 max-w-xl">
        Stay safe, track your sensors, and get instant emergency assistance.  
      </p>
      
      <div className="mt-6 flex gap-6">
        <a href="/sensors" className="px-6 py-3 rounded-lg text-lg font-semibold text-white bg-white/30 backdrop-blur-md hover:bg-white/40 transition-all shadow-lg">
          📡 View Sensors
        </a>
        <a href="/emergency" className="px-6 py-3 rounded-lg text-lg font-semibold text-white bg-red-600 shadow-lg hover:bg-red-700 transition-all">
          🚨 Emergency Contacts
        </a>
      </div>

      {/* 🌸 Floating Animated Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/3 w-40 h-40 bg-pink-300 opacity-40 blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-red-500 opacity-30 blur-3xl"></div>
      </div>
    </section>
  );
}
