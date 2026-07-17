import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import FuelInventory from "./Pages/FuelInventory";
import Sales from "./Pages/Sales";
import Employees from "./Pages/Employees";
import Reports from "./Pages/Reports";
import AIAssistant from "./Pages/AIAssistant";
import ManagerDashboard from "./Pages/ManagerDashboard";
import UserManagement from "./Pages/UserManagement";
import Profile from "./Pages/Profile";
import AuditLog from "./Pages/AuditLog";
import SystemHealth from "./Pages/SystemHealth";
import Procurement from "./Pages/Procurement";
import ProtectedRoute from "./components/ProtectedRoute";

import MainLayout from "./layout/MainLayout";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Login Page (No Sidebar) */}
                <Route path="/" element={<Login />} />

                {/* All Application Pages */}
                <Route element={<MainLayout />}>

                    {/* Common Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* Admin & Manager Only */}
                    <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MANAGER']} />}>
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/ai" element={<AIAssistant />} />
                        <Route path="/employees" element={<Employees />} />
                        <Route path="/manager" element={<ManagerDashboard />} />
                        <Route path="/health" element={<SystemHealth />} />
                        <Route path="/procurement" element={<Procurement />} />
                    </Route>

                    {/* Admin Only */}
                    <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/audit-logs" element={<AuditLog />} />
                    </Route>

                    {/* All roles have some access to fuel and sales, backend can handle finer details */}
                    <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_OPERATOR']} />}>
                        <Route path="/fuel" element={<FuelInventory />} />
                        <Route path="/sales" element={<Sales />} />
                    </Route>

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;