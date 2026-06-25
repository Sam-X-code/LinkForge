import { Route , Routes } from "react-router-dom";
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/Analytics";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
        <Routes>

            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard"
                   element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
            <Route path="/analytics/:shortCode" 
                   element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    } />
                    
        </Routes>
  )
}

export default AppRoutes;
