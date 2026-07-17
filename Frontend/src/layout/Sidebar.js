import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
    FaTachometerAlt,
    FaGasPump,
    FaMoneyBillWave,
    FaUsers,
    FaChartBar,
    FaRobot,
    FaSignOutAlt,
    FaCog,
    FaBell,
    FaFileInvoiceDollar,
    FaServer
} from "react-icons/fa";
import "../Style/EnterpriseTheme.css";

function Sidebar() {
    const navigate = useNavigate();
    const { user, logout: authLogout } = useContext(AuthContext);

    const logout = () => {
        authLogout();
        navigate("/");
    };

    let userRoles = [];
    if (user) {
        if (user.roles) {
            userRoles = user.roles;
        } else if (user.role) {
            userRoles = [user.role];
        } else if (localStorage.getItem('admin')) {
            userRoles = ['ROLE_ADMIN'];
        }
    }

    return (
        <div className="enterprise-sidebar" style={{ width: '250px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid var(--glass-border)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: 'var(--color-primary)', padding: '10px', borderRadius: '10px', display: 'flex' }}>
                    <FaGasPump size={24} color="white" />
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Smart Fuel</h3>
                    <small style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Enterprise Edition</small>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                <NavLink to="/dashboard" className="nav-link-custom">
                    <FaTachometerAlt /> <span>Dashboard</span>
                </NavLink>

                <NavLink to="/fuel" className="nav-link-custom">
                    <FaGasPump /> <span>Fuel Inventory</span>
                </NavLink>

                <NavLink to="/sales" className="nav-link-custom">
                    <FaMoneyBillWave /> <span>Sales</span>
                </NavLink>

                {/* Manager & Admin Only */}
                {userRoles.some(r => ['ROLE_ADMIN', 'ROLE_MANAGER'].includes(r)) && (
                    <>
                        <NavLink to="/employees" className="nav-link-custom">
                            <FaUsers /> <span>Employees</span>
                        </NavLink>
                        <NavLink to="/reports" className="nav-link-custom">
                            <FaChartBar /> <span>Reports</span>
                        </NavLink>
                        <NavLink to="/invoices" className="nav-link-custom">
                            <FaFileInvoiceDollar /> <span>Invoices</span>
                        </NavLink>
                        <NavLink to="/ai" className="nav-link-custom">
                            <FaRobot /> <span>AI Assistant</span>
                        </NavLink>
                        <NavLink to="/health" className="nav-link-custom">
                            <FaServer /> <span>System Health</span>
                        </NavLink>
                        <NavLink to="/manager" className="nav-link-custom">
                            <FaCog /> <span>Control Center</span>
                        </NavLink>
                        <NavLink to="/procurement" className="nav-link-custom">
                            <FaFileInvoiceDollar /> <span>Procurement</span>
                        </NavLink>
                    </>
                )}

                {/* Admin Only */}
                {userRoles.includes('ROLE_ADMIN') && (
                    <>
                        <NavLink to="/users" className="nav-link-custom" style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                            <FaUsers /> <span>Users</span>
                        </NavLink>
                        <NavLink to="/audit-logs" className="nav-link-custom">
                            <FaChartBar /> <span>Audit Logs</span>
                        </NavLink>
                    </>
                )}

                <NavLink to="/profile" className="nav-link-custom" style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                    <FaCog /> <span>Profile</span>
                </NavLink>
            </div>

            <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)' }}>
                <button onClick={logout} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--color-danger)'; e.currentTarget.style.color = 'white'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-danger)'; }}>
                    <FaSignOutAlt /> <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;