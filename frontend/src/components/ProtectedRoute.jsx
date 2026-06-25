import { useEffect, useState } from "react";
import { Navigate} from "react-router-dom";
import api from "../api/axios";

export default function ProtectedRoute({ children }) {

    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await api.get("/users/current-user");
                setIsAuthenticated(true);
            } 
            catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();

    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-semibold">
                    Loading...
                </h1>
            </div>
        );
    }

    if(isAuthenticated === false){
        return <Navigate to="/" replace />;
    }

    return children;
}