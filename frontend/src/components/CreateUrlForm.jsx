import api from "../api/axios";
import { useState } from "react";
import toast from "react-hot-toast";



export default function CreateUrlForm({ fetchUrls }){
    const [loading, setLoading] = useState(false);
    const [originalUrl,setOriginalUrl] = useState("");
    const [customAlias,setCustomAlias] = useState("");
    const [expiresIn, setExpiresIn] = useState("never");

    const handleCreate = async (e) => {
        e.preventDefault();
        try{
           setLoading(true);
            const response = await api.post("/urls/create",
                {originalUrl,customAlias,expiresIn}
            );

            if (response.data.success) {
                setOriginalUrl("");
                setCustomAlias("");
                setExpiresIn("never");
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

    {/* Custom Alias */}
    <div>
        <label className="block mb-2 text-sm font-semibold text-gray-700">
            Custom Alias
            <span className="font-normal text-gray-400"> (Optional)</span>
        </label>

        <input
            type="text"
            placeholder="e.g. github"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            className="
                w-full
                h-12
                rounded-xl
                border border-gray-300
                px-4
                text-sm md:text-base
                outline-none
                transition-all
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
            "
        />

        <p className="mt-2 text-xs text-gray-500">
            Leave empty to generate a random short URL.
        </p>
    </div>

    {/* Link Expiration */}
    <div>
        <label className="block mb-2 text-sm font-semibold text-gray-700">
            Link Expiration
        </label>

        <select
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            className="
                w-full
                h-12
                rounded-xl
                border border-gray-300
                bg-white
                px-4
                text-sm md:text-base
                outline-none
                cursor-pointer
                transition-all
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
            "
        >
            <option value="never">♾️ Never Expire</option>
            <option value="5m">⏱️ 5 Minutes</option>
            <option value="10m">⏱️ 10 Minutes</option>
            <option value="30m">⏱️ 30 Minutes</option>
            <option value="1h">🕐 1 Hour</option>
            <option value="1d">📅 1 Day</option>
            <option value="7d">🗓️ 7 Days</option>
            <option value="30d">📆 30 Days</option>
        </select>

        <p className="mt-2 text-xs text-gray-500">
            Expired links will automatically return a
            <span className="font-medium text-red-500"> 410 Gone</span> response.
        </p>
    </div>

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