import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    FaGasPump,
    FaHome,
    FaMoneyBillWave,
    FaUsers,
    FaChartBar,
    FaRobot,
    FaSignOutAlt
} from "react-icons/fa";

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {

        // Remove login session
        localStorage.removeItem("user");

        // Redirect to Login Page
        navigate("/");
    };

    const activeStyle = (path) => {
        return location.pathname === path
            ? "btn btn-primary me-2 mb-2"
            : "btn btn-outline-light me-2 mb-2";
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">

            <div className="container">

                {/* Logo */}
                <Link className="navbar-brand fw-bold" to="/dashboard">
                    <FaGasPump className="me-2" />
                    Smart Fuel Station
                </Link>
``
                {/* Mobile Toggle */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation */}
                <div className="collapse navbar-collapse" id="navbarNav">

                    <div className="ms-auto">

                        <Link
                            to="/dashboard"
                            className={activeStyle("/dashboard")}
                        >
                            <FaHome className="me-1" />
                            Dashboard
                        </Link>

                        <Link
                            to="/fuel"
                            className={activeStyle("/fuel")}
                        >
                            <FaGasPump className="me-1" />
                            Fuel
                        </Link>

                        <Link
                            to="/sales"
                            className={activeStyle("/sales")}
                        >
                            <FaMoneyBillWave className="me-1" />
                            Sales
                        </Link>

                        <Link
                            to="/employees"
                            className={activeStyle("/employees")}
                        >
                            <FaUsers className="me-1" />
                            Employees
                        </Link>

                        <Link
                            to="/reports"
                            className={activeStyle("/reports")}
                        >
                            <FaChartBar className="me-1" />
                            Reports
                        </Link>

                        <Link
                            to="/ai"
                            className={activeStyle("/ai")}
                        >
                            <FaRobot className="me-1" />
                            AI Assistant
                        </Link>

                        <button
                            className="btn btn-danger mb-2"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt className="me-1" />
                            Logout
                        </button>

                    </div>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;