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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">
                URL Analytics
            </h1>

            <button
                onClick={() => navigate("/dashboard")}
                className="self-end sm:self-auto bg-gray-700 hover:bg-gray-800 text-white text-sm sm:text-base px-3 py-2 sm:px-4 rounded-lg transition"
            >
                ← Back to Dashboard
            </button>
        </div>

        {/* Analytics Card */}
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 md:p-8 space-y-6">
            {/* Original URL */}
            <div>
                <h2 className="text-gray-500 font-semibold text-sm sm:text-base">
                    Original URL
                </h2>

                <p className="text-base sm:text-lg break-all">
                    {analytics.originalUrl}
                </p>
            </div>

            {/* Short URL */}
            <div>
                <h2 className="text-gray-500 font-semibold text-sm sm:text-base">
                    Short URL
                </h2>

                <a
                    href={analytics.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline break-all"
                >
                    {analytics.shortUrl}
                </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-5">
                    <h2 className="text-gray-500 font-semibold text-sm sm:text-base">
                        Total Clicks
                    </h2>

                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                        {analytics.clicks}
                    </p>
                </div>

                <div className="bg-green-50 rounded-lg p-5">
                    <h2 className="text-gray-500 font-semibold text-sm sm:text-base">
                        Created At
                    </h2>

                    <p className="font-semibold text-sm sm:text-base wrap-break-word">
                        {new Date(analytics.createdAt).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    </div>
);


}