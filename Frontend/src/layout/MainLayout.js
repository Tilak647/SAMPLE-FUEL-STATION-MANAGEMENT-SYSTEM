import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import "./MainLayout.css";

function MainLayout() {
    return (
        <div className="layout">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="main-content">

                {/* Top Navigation */}
                <TopNavbar />

                {/* Page Content */}
                <main className="page-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default MainLayout;