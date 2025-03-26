export default function SensorData() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sensor Data</h1>

      <p className="text-lg text-gray-600">Live data from the wearable device will be displayed here.</p>

      <a href="/" className="mt-4 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
        Back to Home
      </a>
    </div>
  );
}
