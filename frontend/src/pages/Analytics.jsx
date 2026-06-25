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
        
            
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="flex justify-between px-1.5">
                <h1 className="text-4xl font-bold text-blue-600 mb-8">
                    URL Analytics
                </h1>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="mb-6 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
                >
                    ← Back to Dashboard
                </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">

                    <div>
                        <h2 className="text-gray-500 font-semibold">
                            Original URL
                        </h2>

                        <p className="text-lg break-all">
                            {analytics.originalUrl}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-gray-500 font-semibold">
                            Short URL
                        </h2>

                        <a
                            href={analytics.shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {analytics.shortUrl}
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-6">

                        <div className="bg-blue-50 rounded-lg p-5">
                            <h2 className="text-gray-500 font-semibold">
                                Total Clicks
                            </h2>

                            <p className="text-3xl font-bold text-blue-600">
                                {analytics.clicks}
                            </p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-5">
                            <h2 className="text-gray-500 font-semibold">
                                Created At
                            </h2>

                            <p className="font-semibold">
                                {new Date(
                                    analytics.createdAt
                                ).toLocaleString()}
                            </p>
                        </div>

                    </div>

                </div>

            </div>
           
        );


}