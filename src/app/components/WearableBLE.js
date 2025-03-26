"use client"; // Ensures client-side execution in Next.js
import { useState, useEffect } from "react";

export default function WearableDashboard() {
    // Bluetooth and device states
    const [device, setDevice] = useState(null);
    const [server, setServer] = useState(null);
    const [deviceName, setDeviceName] = useState(null);
    const [stepCount, setStepCount] = useState(0);
    const [location, setLocation] = useState(null);
    const [isBusy, setIsBusy] = useState(false);
    
    // UUIDs for Bluetooth communication
    const [serviceUUID, setServiceUUID] = useState(null);
    const [readUUID, setReadUUID] = useState(null);
    const [notifyUUID, setNotifyUUID] = useState(null);

    /** 🔌 Handle Bluetooth Disconnection */
    function onDisconnected(event) {
        console.warn("⚠️ Device disconnected:", event.target.name);
        setDevice(null);
        setServer(null);
        alert("⚠️ Bluetooth device disconnected.");
    }

    /** 🔗 Connect to Bluetooth Device */
    async function connectToDevice() {
        try {
            let selectedDevice = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ["generic_access"],
            });

            const server = await selectedDevice.gatt.connect();
            setDevice(selectedDevice);
            setServer(server);
            setDeviceName(selectedDevice.name);

            alert(`✅ Connected to: ${selectedDevice.name}`);

            // List available services
            listAvailableServices(selectedDevice, server);

            // Handle disconnection
            selectedDevice.addEventListener("gattserverdisconnected", onDisconnected);
        } catch (error) {
            console.error("❌ Connection error:", error);
            alert("❌ Connection failed.");
        }
    }

    /** 🔍 Get Available Services & UUIDs */
    async function listAvailableServices(device, server) {
        try {
            const services = await server.getPrimaryServices();
            console.log("📡 Available Services:");
            services.forEach(service => console.log(`🔹 Service UUID: ${service.uuid}`));

            if (services.length > 0) {
                const firstService = services[0];
                setServiceUUID(firstService.uuid);

                const characteristics = await firstService.getCharacteristics();
                characteristics.forEach(char => console.log(`🔸 Characteristic UUID: ${char.uuid}`));

                if (characteristics.length > 0) {
                    setReadUUID(characteristics[0].uuid);
                    if (characteristics.length > 1) setNotifyUUID(characteristics[1].uuid);
                }
            } else {
                alert("❌ No Bluetooth services found.");
            }
        } catch (error) {
            console.error("❌ Service listing error:", error);
        }
    }

    /** 📍 Get User Location */
    function getUserLocation() {
        if (!navigator.geolocation) {
            alert("❌ Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                console.log(`📍 Coordinates: Lat ${latitude}, Lng ${longitude}`);

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();
                    const address = data.display_name || "Address not found";

                    console.log(`🏡 Location: ${address}`);
                    alert(`📍 Location:\n${address}`);
                    setLocation(address);
                } catch (error) {
                    console.error("❌ Reverse Geocoding error:", error);
                    alert("❌ Failed to fetch address.");
                }
            },
            (error) => {
                console.error("❌ Location error:", error);
                alert("❌ Failed to get location.");
            }
        );
    }

    useEffect(() => {
        getUserLocation();
        return () => {
            if (device) {
                device.removeEventListener("gattserverdisconnected", onDisconnected);
            }
        };
    }, []);

    /** 📧 Send Emergency Email */
    async function sendEmergencyEmail() {
        if (!location) {
            getUserLocation();
        }

        try {
            const response = await fetch("/api/sendEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location,
                    message: "🚨 Emergency Alert! Please check the location.",
                }),
            });

            const data = await response.json();
            if (data.success) {
                alert("✅ Emergency emails sent!");
            } else {
                alert("❌ Email sending failed.");
            }
        } catch (error) {
            console.error("❌ API error:", error);
            alert("❌ Error sending email.");
        }
    }

    /** 📖 Read Step Count Data */
    async function readStepCount() {
        if (!server || !serviceUUID || !readUUID) {
            return console.warn("⏳ No device connected or service UUID missing.");
        }
        setIsBusy(true);

        try {
            console.log(`📖 Reading from ${readUUID}...`);
            const service = await server.getPrimaryService(serviceUUID);
            const characteristic = await service.getCharacteristic(readUUID);
            const value = await characteristic.readValue();

            const rawBytes = new Uint8Array(value.buffer);
            const stepCountValue = rawBytes[0] || 0;

            console.log(`📖 Step Count: ${stepCountValue}`);
            setStepCount(stepCountValue);
        } catch (error) {
            console.error("❌ Read error:", error);
            alert("❌ Read failed.");
        } finally {
            setIsBusy(false);
        }
    }

    return (
        <div className="container">
        {/* Navbar */}
        <nav className="navbar">
            <a href="#" className="nav-link">🏠 Home</a>
            <a href="#" className="nav-link">📡 Sensors</a>
            <a href="#" className="nav-link emergency">🚨 Emergency</a>
        </nav>

        {/* Heading */}
        <h1 className="title">💖 Women's Safety Web App</h1>

        {/* Card Section */}
        <div className="card">
            <button onClick={connectToDevice} className="btn connect">🔗 Connect to Smartwatch</button>
            {deviceName && <p className="connected">✅ Connected to: {deviceName}</p>}

            <p className="info">📍 Step Count: {stepCount}</p>

            {/* Action Buttons */}
            <div className="button-group">
                <button onClick={readStepCount} className="btn action">🚶 Read Steps</button>
                <button onClick={getUserLocation} className="btn action">📍 Get Location</button>
                <button onClick={sendEmergencyEmail} className="btn danger">🚨 Emergency Email</button>
            </div>

            {/* Status Indicators */}
            <p className="status">🔊 Listening for 'Help'...</p>
            <p className="status">🔄 Shake detection active...</p>
        </div>

        {/* Styling */}
        <style jsx>{`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

            .container {
                text-align: center;
                padding: 20px;
                font-family: 'Poppins', sans-serif;
                background: linear-gradient(135deg, #ff9a9e, #fad0c4);
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            
            .navbar {
                display: flex;
                gap: 20px;
                margin-bottom: 20px;
            }

            .nav-link {
                color: white;
                text-decoration: none;
                font-size: 18px;
                font-weight: 600;
                padding: 10px 20px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.2);
                transition: all 0.3s;
            }

            .nav-link:hover {
                background: rgba(255, 255, 255, 0.4);
                transform: scale(1.05);
            }

            .emergency {
                background: #ff4d4d;
                color: white;
            }

            .title {
                font-size: 32px;
                font-weight: bold;
                color: #fff;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            }

            .card {
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
                width: 350px;
            }

            .btn {
                background: #ff69b4;
                color: white;
                padding: 12px 18px;
                border: none;
                border-radius: 10px;
                margin: 10px 5px;
                transition: all 0.3s;
                font-size: 16px;
                cursor: pointer;
                box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
            }

            .btn:hover {
                background: #ff1493;
                transform: scale(1.05);
                box-shadow: 2px 2px 12px rgba(255, 105, 180, 0.6);
            }

            .btn.danger {
                background: #ff3333;
            }

            .btn.danger:hover {
                background: #cc0000;
                box-shadow: 2px 2px 12px rgba(255, 51, 51, 0.6);
            }

            .info {
                font-size: 18px;
                font-weight: 600;
                color: white;
                margin-top: 10px;
            }

            .status {
                color: #ffecb3;
                font-size: 16px;
                margin-top: 10px;
            }
        `}</style>
    </div>
    );
}
