import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import CreateUrlForm from "../components/CreateUrlForm";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [urls, setUrls] = useState([]);
    const navigate = useNavigate();

    const fetchUrls = async () => {
        try {
            const response = await api.get("/urls/my-urls");
            setUrls(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCopy = async (shortCode) => {
        const shortUrl = `${import.meta.env.VITE_BASE_URL}/${shortCode}`;

        try {
            await navigator.clipboard.writeText(shortUrl);
            toast.success("Copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy");
        }
    };

    const handleDelete = async (shortCode) => {
        try {
            await api.delete(`/urls/delete/${shortCode}`);
            fetchUrls();
            toast.success("URL deleted!");
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);

            await api.post("/users/logout");

            toast.success("Logged out successfully!");

            navigate("/",{replace:true});
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUrls();

        const handleFocus = () => {
            fetchUrls();
        };

        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 to-gray-200 py-6 md:py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-blue-600">
                            🔗 Dashboard
                        </h1>

                        <p className="text-gray-500 mt-2 text-sm md:text-base">
                            Manage and analyze all your shortened URLs
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            if (window.confirm("Do you want to log out?")) {
                                handleLogout();
                            }
                        }}
                        disabled={loading}
                        className={`self-start sm:self-start sm:ml-auto px-4 py-2 rounded-lg text-sm font-semibold text-white transition duration-200 shadow-md
                                ${
                                    loading
                                        ? "bg-red-300 cursor-not-allowed"
                                        : "bg-red-500 hover:bg-red-600 hover:shadow-lg"
                        }`}
                    >
                        {loading ? "Logging out..." : "Logout"}
                    </button>
                </div>

                {/* Create URL */}
                <div className="mb-8">
                    <CreateUrlForm fetchUrls={fetchUrls} />
                </div>

                {/* URL Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-[2fr_2fr_1.5fr] bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-4">
                        <div className="text-left">Original URL</div>
                        <div className="text-left">Short URL</div>
                        <div className="text-center">Actions</div>
                    </div>

                    {urls.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="text-7xl mb-5">🔗</div>

                            <h2 className="text-2xl font-bold text-gray-700">
                                No URLs Found
                            </h2>

                            <p className="text-gray-500 mt-3">
                                Create your first short URL using the form
                                above.
                            </p>
                        </div>
                    ) : (
                        urls.map((url) => (
                            <div
                                key={url._id}
                                className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1.5fr] gap-4 md:gap-0 items-start md:items-center px-5 md:px-6 py-5 border-b hover:bg-blue-50 transition"
                            >
                                {/* Original URL */}
                                <div className="pr-0 md:pr-4">
                                    <p className="md:hidden text-xs text-gray-500 font-semibold mb-1">
                                        Original URL
                                    </p>

                                    <p className="truncate font-medium text-gray-700">
                                        {url.originalUrl}
                                    </p>
                                </div>

                                {/* Short URL */}
                                <div>
                                    <p className="md:hidden text-xs text-gray-500 font-semibold mb-1">
                                        Short URL
                                    </p>

                                    <a
                                        href={url.shortUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 font-medium hover:text-blue-800 hover:underline break-all"
                                    >
                                        {url.shortUrl}
                                    </a>
                                </div>

                                {/* Buttons */}
                                <div>
                                    <p className="md:hidden text-xs text-gray-500 font-semibold mb-2">
                                        Actions
                                    </p>

                                    <div className="flex justify-start md:justify-center gap-3">
                                        <button
                                            onClick={() =>
                                                handleCopy(url.shortCode)
                                            }
                                            className="bg-green-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                                        >
                                            <img
                                                src="/assets/copy.png"
                                                alt="Copy"
                                                className="w-4 h-4"
                                            />
                                        </button>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/analytics/${url.shortCode}`
                                                )
                                            }
                                            className="bg-purple-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                                        >
                                            <img
                                                src="/assets/analytics.png"
                                                alt="Analytics"
                                                className="w-4 h-4"
                                            />
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (
                                                    window.confirm(
                                                        "Delete this URL?"
                                                    )
                                                ) {
                                                    handleDelete(
                                                        url.shortCode
                                                    );
                                                }
                                            }}
                                            className="bg-red-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                                        >
                                            <img
                                                src="/assets/delete.png"
                                                alt="Delete"
                                                className="w-4 h-4"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}