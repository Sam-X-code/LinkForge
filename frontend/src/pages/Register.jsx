import api from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            setLoading(true);
            const response = await api.post("/users/register",
                {
                    username,
                    email,
                    fullName,
                    password
                }
            )
            
            if(response.data.success){
                toast.success("Registration Successful!")
                setUsername("");
                setEmail("");
                setFullName("");
                setPassword("");

                navigate("/");
            }
        }
        catch(error){
            toast.error(error.response?.data?.message || "Try Again!");
        }
        finally{
            setLoading(false);
        }
    }
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6">

            <h1 className="text-3xl font-bold text-center text-blue-600">
                LinkForge
            </h1>

            <p className="text-center text-gray-500 mb-5">
                Create your account
            </p>

            <form
                onSubmit={handleRegister}
                className="space-y-3"
            >

                <div>
                    <label className="block mb-1 font-medium">
                        Username
                    </label>

                    <input
                        type="text"
                        value={username}
                        placeholder="Enter username"
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Full Name
                    </label>

                    <input
                        type="text"
                        value={fullName}
                        placeholder="Enter your full name"
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        placeholder="Create a password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 rounded-lg font-semibold text-white transition
                        ${
                            loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Registering..." : "Register"}
                </button>

            </form>

            <p className="text-center text-gray-600 mt-5">
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="text-blue-600 font-semibold hover:underline"
                >
                    Login
                </button>
            </p>

        </div>
    </div>
);
}