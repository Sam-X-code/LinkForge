import api from "../api/axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState("");
    const [password,setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            console.log("Login button clicked");
            const loginData = {password};

            if (identifier.includes("@")) {
                loginData.email = identifier;
            } else {
                loginData.username = identifier;
            }

            const response = await api.post("/users/login",loginData);

            if (response.data.success) {
                navigate("/dashboard");
            }
        }
        catch(error){
            console.log(error);
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    LinkForge
                </h1>

                <form className="space-y-4"
                    onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 font-medium">
                            Username / Email
                        </label>

                        <input
                            type="text"
                            value={identifier}
                            onChange={(e)=> setIdentifier(e.target.value)}
                            placeholder="Enter username or email"
                            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Login
                    </button>

                </form>

                <p className="text-center mt-6">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 font-semibold"
                    >
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
}