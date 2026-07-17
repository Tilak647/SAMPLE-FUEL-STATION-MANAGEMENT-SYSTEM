import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import RevenueChart from "../Comp/RevenueChart";
import "../Style/Dashboard.css";
import PageHeader from "../Comp/PageHeader";
import KPICard from "../Comp/KPICard";
import {
    FaGasPump,
    FaUsers,
    FaMoneyBillWave,
    FaChartLine,
    FaOilCan,
    FaReceipt,
    FaBolt,
    FaCalendarAlt,
    FaExclamationTriangle
} from "react-icons/fa";

function Dashboard() {
    const [dashboard, setDashboard] = useState({
        todayRevenue: 0,
        todaySales: 0,
        weeklyRevenue: 0,
        monthlyRevenue: 0,
        petrolStock: 0,
        dieselStock: 0,
        totalEmployees: 0,
        recentSales: [],
        topSellingFuel: "",
        businessGrowth: "",
        revenueTrend: [],
        lowStockAlert: "",
        petrolRefillDate: "",
        dieselRefillDate: "",
        recentReports: [],
        aiInsights: ""
    });

    useEffect(() => {
        fetchDashboard();
        
        // Setup SSE for Live Dashboard updates
        const eventSource = new EventSource("http://localhost:8080/api/events/stream");
        
        eventSource.onmessage = (event) => {
            console.log("Live Event Received: ", event.data);
            // Refresh dashboard data when an event occurs
            fetchDashboard();
        };

        eventSource.onerror = (error) => {
            console.error("SSE Error:", error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/dashboard");
            console.log("DASHBOARD API RESPONSE:", response.data);
            setDashboard(response.data);
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        }
    };

    return (
        <div className="container-fluid mt-4 px-4">
            <PageHeader
                title="🚀 Enterprise Dashboard"
                subtitle="Real-time analytics, inventory monitoring, and AI insights."
            />
            
            {/* KPI Cards Row 1 */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <KPICard 
                        title="Today's Revenue" 
                        value={`₹ ${dashboard.todayRevenue || 0}`} 
                        icon={<FaMoneyBillWave />} 
                        colorClass="kpi-card-primary" 
                    />
                </div>
                <div className="col-md-3">
                    <KPICard 
                        title="Today's Sales" 
                        value={dashboard.todaySales || 0} 
                        icon={<FaReceipt />} 
                        colorClass="kpi-card-success" 
                    />
                </div>
                <div className="col-md-3">
                    <KPICard 
                        title="Weekly Revenue" 
                        value={`₹ ${dashboard.weeklyRevenue || 0}`} 
                        icon={<FaChartLine />} 
                        colorClass="kpi-card-warning" 
                    />
                </div>
                <div className="col-md-3">
                    <KPICard 
                        title="Monthly Revenue" 
                        value={`₹ ${dashboard.monthlyRevenue || 0}`} 
                        icon={<FaCalendarAlt />} 
                        colorClass="kpi-card-danger" 
                    />
                </div>
            </div>

            {/* KPI Cards Row 2 */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <KPICard 
                        title="Petrol Stock" 
                        value={`${dashboard.petrolStock || 0} L`} 
                        icon={<FaOilCan />} 
                        colorClass="kpi-card-warning" 
                    />
                </div>
                <div className="col-md-3">
                    <KPICard 
                        title="Diesel Stock" 
                        value={`${dashboard.dieselStock || 0} L`} 
                        icon={<FaGasPump />} 
                        colorClass="kpi-card-primary" 
                    />
                </div>
                <div className="col-md-3">
                    <KPICard 
                        title="Total Employees" 
                        value={dashboard.totalEmployees || 0} 
                        icon={<FaUsers />} 
                        colorClass="kpi-card-success" 
                    />
                </div>
                <div className="col-md-3">
                    <KPICard 
                        title="Business Growth" 
                        value={dashboard.businessGrowth || 'N/A'} 
                        icon={<FaBolt />} 
                        colorClass="kpi-card-danger" 
                    />
                </div>
            </div>

            <div className="row g-4 mb-4">
                {/* Insights and Alerts */}
                <div className="col-md-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card h-100"
                    >
                        <div className="card-header bg-transparent border-0 pt-4 px-4">
                            <h5 className="text-white mb-0">
                                <FaExclamationTriangle className="text-warning me-2" />
                                Alerts & Insights
                            </h5>
                        </div>
                        <div className="card-body px-4">
                            {dashboard.lowStockAlert && (
                                <div className="alert alert-danger shadow-sm border-0 mb-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5' }}>
                                    <strong>Low Stock Alert:</strong> {dashboard.lowStockAlert}
                                </div>
                            )}
                            <div className="bg-dark p-3 rounded mb-3" style={{ backgroundColor: 'rgba(30, 41, 59, 0.5) !important' }}>
                                <h6 className="text-muted mb-1">Top Selling Fuel</h6>
                                <h4 className="text-white mb-0">{dashboard.topSellingFuel || 'N/A'}</h4>
                            </div>
                            <div className="bg-dark p-3 rounded mb-3" style={{ backgroundColor: 'rgba(30, 41, 59, 0.5) !important' }}>
                                <h6 className="text-muted mb-1">Refill Predictions</h6>
                                <p className="text-white mb-1">Petrol: <strong>{dashboard.petrolRefillDate || 'Calculating...'}</strong></p>
                                <p className="text-white mb-0">Diesel: <strong>{dashboard.dieselRefillDate || 'Calculating...'}</strong></p>
                            </div>
                            {dashboard.aiInsights && (
                                <div className="alert alert-info shadow-sm border-0 mb-0" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93C5FD' }}>
                                    <strong>AI Recommendation:</strong> {dashboard.aiInsights}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Charts Area */}
                <div className="col-md-8">
                    <RevenueChart trendData={dashboard.revenueTrend || []} recentSales={dashboard.recentSales || []} />
                </div>
            </div>

            {/* Recent Activities Section */}
            <div className="row g-4">
                <div className="col-md-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card"
                    >
                        <div className="card-header border-0 bg-transparent pt-4 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="text-white mb-0">Recent Sales</h5>
                            <span className="badge badge-success">Live</span>
                        </div>
                        <div className="card-body px-4">
                            <div className="table-responsive">
                                <table className="enterprise-table">
                                    <thead>
                                        <tr>
                                            <th>Bill No</th>
                                            <th>Customer</th>
                                            <th>Fuel</th>
                                            <th>Liters</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboard.recentSales && dashboard.recentSales.length > 0 ? (
                                            dashboard.recentSales.slice(0, 5).map((sale) => (
                                                <tr key={sale.id}>
                                                    <td className="text-white fw-bold">#{sale.billNo}</td>
                                                    <td>{sale.customerName}</td>
                                                    <td>
                                                        <span className={`badge ${sale.fuelType.toLowerCase() === 'petrol' ? 'badge-warning' : 'badge-primary'}`}>
                                                            {sale.fuelType}
                                                        </span>
                                                    </td>
                                                    <td>{sale.liters} L</td>
                                                    <td className="text-success fw-bold">₹ {sale.amount}</td>
                                                    <td className="text-muted">
                                                        {sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : "N/A"}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center text-muted">No Recent Sales</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                </div>
                
                <div className="col-md-4">
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card h-100"
                    >
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h5 className="text-white mb-0">Recent Reports</h5>
                        </div>
                        <div className="card-body px-4">
                            {dashboard.recentReports && dashboard.recentReports.length > 0 ? (
                                dashboard.recentReports.slice(0, 5).map((report, index) => (
                                    <div key={index} className="d-flex align-items-center mb-3 p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                        <div className="me-3 text-primary">
                                            <FaCalendarAlt size={24} />
                                        </div>
                                        <div>
                                            <h6 className="text-white mb-1">{report.reportType} Report</h6>
                                            <small className="text-muted">Generated: {new Date(report.generatedAt).toLocaleDateString()}</small>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted text-center mt-4">No recent reports found.</p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;