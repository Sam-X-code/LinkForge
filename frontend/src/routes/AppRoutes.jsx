import { Route , Routes } from "react-router-dom";
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/Analytics";
import Register from "../pages/Register";

const AppRoutes = () => {
  return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/analytics/:shortCode" element={<Analytics/>} />
        </Routes>
  )
}

export default AppRoutes;
