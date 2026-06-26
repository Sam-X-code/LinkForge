import api from "../api/axios";
import { useState } from "react";
import toast from "react-hot-toast";



export default function CreateUrlForm({ fetchUrls }){
    const [loading, setLoading] = useState(false);
    const [originalUrl,setOriginalUrl] = useState("");
    const [customAlias,setCustomAlias] = useState("");

    const handleCreate = async (e) => {
        e.preventDefault();
        try{
           setLoading(true);
            const response = await api.post("/urls/create",
                {originalUrl,customAlias}
            );

            if (response.data.success) {
                setOriginalUrl("");
                setCustomAlias("");
                toast.success(response.data.message);
                fetchUrls();
                
            }
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Create Short URL
            </h2>

            <form
                onSubmit={handleCreate}
                className="space-y-5"
            >

                <div>
                    <label className="block mb-2 font-medium text-gray-700">
                        Original URL
                    </label>

                    <input
                        type="text"
                        placeholder="https://example.com"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium text-gray-700">
                        Custom Alias (Optional)
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. github"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled = {loading}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200
                        ${
                            loading ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Creating..." : "Create Short URL"}
                </button>

            </form>

        </div>
    );
}