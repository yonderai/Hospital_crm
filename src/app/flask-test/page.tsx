"use client";

import { useEffect, useState } from "react";

// Types for our API responses
type SystemStatus = "online" | "offline";
type DbStatus = "connected" | "disconnected" | "unknown";

interface HealthResponse {
    status: SystemStatus;
    service: string;
    db: DbStatus;
}

export default function FlaskTestPage() {
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    // Function to fetch data
    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            // Fetch Health Status from Port 5001
            const healthRes = await fetch("http://127.0.0.1:5001/api/health");

            if (!healthRes.ok) {
                throw new Error(`HTTP error! status: ${healthRes.status}`);
            }

            const healthData: HealthResponse = await healthRes.json();
            setHealth(healthData);

        } catch (err: any) {
            console.error("Fetch error:", err);
            setError(err.message || "Failed to connect to backend");
            setHealth({ status: "offline", service: "Flask Backend", db: "unknown" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Backend Status (Port 5001)</h1>

                {/* Connection Status Cards */}
                <div className="space-y-4 mb-8">
                    <StatusRow
                        label="Flask API Content"
                        status={health?.status === "online"}
                        text={health?.service || "Unknown"}
                    />
                    <StatusRow
                        label="Database Connection"
                        status={health?.db === "connected"}
                        text={health?.db === "connected" ? "Connected" : "Disconnected"}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-center">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
                    >
                        {loading ? "Checking..." : "Refresh Status"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatusRow({ label, status, text }: { label: string, status: boolean, text: string }) {
    return (
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded border">
            <span className="font-medium text-gray-600">{label}</span>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                <span className={`w-2 h-2 rounded-full ${status ? "bg-green-500" : "bg-red-500"}`}></span>
                {text}
            </div>
        </div>
    )
}
