import { useState ,useEffect} from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import CreateUrlForm from "../components/CreateUrlForm";

export default function Dashboard() {

    const [urls, setUrls] = useState([]);

    const fetchUrls = async () => {
        try {
            const response = await api.get("/urls/my-urls");
            setUrls(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCopy = async (shortCode) => {
        const shortUrl = `http://localhost:8000/${shortCode}`;

        try {
            await navigator.clipboard.writeText(shortUrl);
            alert("Copied!");
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (shortCode) => {
        try {
            await api.delete(`/urls/delete/${shortCode}`);
            fetchUrls();
            alert("deleted!");
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUrls();
    }, []);

    return (
        <div>
        <CreateUrlForm fetchUrls={fetchUrls} />
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600">
                        LinkForge Dashboard
                    </h1>

                    <div className="flex gap-3">

                        <button
                            onClick={fetchUrls}
                            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition duration-200 shadow"
                        >
                            🔄 Refresh
                        </button>

                        <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition duration-200 shadow"
                        >
                            Logout
                        </button>

                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">

                    <div className="grid grid-cols-4 bg-blue-600 text-white font-semibold p-4">
                        <div>Original URL</div>
                        <div>Short URL</div>
                        <div>Clicks</div>
                        <div className="text-center">Actions</div>
                    </div>

                    {urls.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No URLs created yet.
                        </div>
                    ) : (
                        urls.map((url) => (
                            <div
                                key={url._id}
                                className="grid grid-cols-4 items-center p-4 border-b hover:bg-gray-50"
                            >
                                <div className="truncate pr-3">
                                    {url.originalUrl}
                                </div>

                                <div>
                                    <a
                                        href={url.shortUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {url.shortUrl}
                                    </a>
                                </div>

                                <div className="font-semibold">
                                    {url.clicks}
                                </div>

                                <div className="flex justify-center gap-2">

                                    <button
                                        onClick={() => handleCopy(url.shortCode)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                    >
                                        Copy
                                    </button>

                                    <button
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                                    >
                                        Analytics
                                    </button>

                                    <button
                                        onClick={() => handleDelete(url.shortCode)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </div>
        </div>
    );
}