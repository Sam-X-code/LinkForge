import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Analytics() {

    const navigate = useNavigate();
    const { shortCode } = useParams();
    const [analytics, setAnalytics] = useState(null);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get(`/urls/analytics/${shortCode}`);
            setAnalytics(response.data.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAnalytics();

        const handleFocus = () => {
            fetchAnalytics();
        };

        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, [shortCode]);

    if (!analytics) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <h1 className="text-2xl font-semibold">
                    Loading...
                </h1>
            </div>
        );
    } 
    return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">

            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                URL Analytics
            </h1>

            <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-xl transition-all shadow-md"
            >
                ← Back to Dashboard
            </button>

        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8 space-y-8">

            {/* Original URL */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-500 mb-2">
                    🌐 Original URL
                </h2>

                <p className="text-gray-800 break-all font-medium">
                    {analytics.originalUrl}
                </p>
            </div>

            {/* Short URL */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-500 mb-2">
                    🔗 Short URL
                </h2>

                <a
                    href={analytics.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline break-all font-medium"
                >
                    {analytics.shortUrl}
                </a>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                {/* Clicks */}
                <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-md text-white">

                    <h2 className="text-sm font-medium opacity-90">
                        👆 Total Clicks
                    </h2>

                    <p className="mt-4 text-4xl font-bold">
                        {analytics.clicks}
                    </p>

                </div>

                {/* Status */}
                <div
                    className={`rounded-2xl p-6 shadow-sm border transition ${
                        analytics.isActive
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                    }`}>

                    <h2 className="text-sm text-gray-500 font-semibold">
                        🚦 Status
                    </h2>

                    <p
                        className={`mt-4 text-2xl font-bold ${
                            analytics.isActive
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {analytics.isActive
                            ? "🟢 Active"
                            : "🔴 Expired"}
                    </p>

                </div>

                {/* Created */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition">

                    <h2 className="text-sm text-gray-500 font-semibold">
                        📅 Created At
                    </h2>

                    <p className="mt-3 text-gray-800 font-semibold wrap-break-word">
                        {new Date(analytics.createdAt).toLocaleString()}
                    </p>

                </div>

                {/* Expiry */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition">

                    <h2 className="text-sm text-gray-500 font-semibold">
                        ⏳ Expires At
                    </h2>

                    <p className="mt-3 text-gray-800 font-semibold wrap-break-word">
                        {analytics.expiresAt
                            ? new Date(analytics.expiresAt).toLocaleString()
                            : "♾️ Never"}
                    </p>

                </div>

            </div>

        </div>

    </div>
);


}