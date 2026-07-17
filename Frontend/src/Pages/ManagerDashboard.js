import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from 'react-countup';
import PageHeader from "../Comp/PageHeader";
import {
    FaTachometerAlt, FaGasPump, FaMoneyBillWave, FaRobot, FaCog, FaChartBar, FaServer, FaCheckCircle, FaTimesCircle, FaDownload, FaSync, FaBell, FaFileInvoiceDollar, FaClock
} from "react-icons/fa";
import "../Style/EnterpriseTheme.css";

function ManagerDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [aiData, setAiData] = useState(null);
    const [fuelData, setFuelData] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [reportsData, setReportsData] = useState([]);
    const [healthData, setHealthData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [events, setEvents] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const [sysStatus, setSysStatus] = useState({
        db: true, email: true, scheduler: true, invoice: true, report: true, ai: true
    });

    useEffect(() => {
        fetchAllData();

        // SSE Listener
        const sse = new EventSource("http://localhost:8080/api/events/stream");
        
        sse.addEventListener("dashboard-refresh", (e) => {
            setEvents(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString(), message: e.data }, ...prev].slice(0, 50));
            fetchAllData();
        });

        sse.addEventListener("notification", (e) => {
            setNotifications(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString(), message: e.data }, ...prev]);
        });

        return () => sse.close();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchAllData = async () => {
        try {
            const [dashRes, aiRes, fuelRes, salesRes, repRes, healthRes] = await Promise.all([
                axios.get("http://localhost:8080/api/dashboard/summary").catch(() => ({ data: null })),
                axios.get("http://localhost:8080/api/ai/intelligence").catch(() => { setSysStatus(s => ({...s, ai: false})); return { data: null }; }),
                axios.get("http://localhost:8080/api/fuel/all").catch(() => ({ data: [] })),
                axios.get("http://localhost:8080/api/sales/recent").catch(() => ({ data: [] })),
                axios.get("http://localhost:8080/api/report/history").catch(() => { setSysStatus(s => ({...s, report: false})); return { data: [] }; }),
                axios.get("http://localhost:8080/actuator/health").catch((err) => ({ data: err.response?.data || null }))
            ]);

            if (!dashRes.data) setSysStatus(s => ({...s, db: false}));

            setDashboardData(dashRes.data);
            setAiData(aiRes.data);
            setFuelData(fuelRes.data);
            setSalesData(salesRes.data?.slice(0, 5) || []);
            setReportsData(repRes.data?.slice(0, 5) || []);
            setHealthData(healthRes.data);
        } catch (error) {
            console.error("Error fetching manager data", error);
        } finally {
            setLoading(false);
        }
    };

    const generateReport = async (type) => {
        try {
            await axios.post(`http://localhost:8080/api/report/generate?type=${type}`);
            alert(`${type} report generation triggered.`);
            fetchAllData();
        } catch (error) {
            alert("Failed to generate report.");
        }
    };

    const dismissNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    if (loading) {
        return <div className="text-center py-5"><FaSync className="fa-spin text-primary" size={50} /><h5 className="mt-3 text-white">Loading Enterprise Operations...</h5></div>;
    }

    const petrol = fuelData.find(f => f.fuelType === 'Petrol') || { stock: 0, pricePerLiter: 0 };
    const diesel = fuelData.find(f => f.fuelType === 'Diesel') || { stock: 0, pricePerLiter: 0 };
    const petrolPct = Math.min((petrol.stock / 10000) * 100, 100).toFixed(0);
    const dieselPct = Math.min((diesel.stock / 10000) * 100, 100).toFixed(0);

    const sysComponents = healthData?.components || {};

    const StatusBadge = ({ status }) => {
        const color = status === 'UP' ? 'success' : (status === 'OUT_OF_SERVICE' || status === 'DOWN' ? 'danger' : 'warning');
        return <span className={`badge bg-${color}`}>{status || 'UNKNOWN'}</span>;
    };

    return (
        <div className="container-fluid mt-4 px-4 pb-5">
            <PageHeader title="🌐 Enterprise Operations Center" subtitle="Real-time monitoring, AI analytics, and control hub." />

            {/* 1. LIVE OPERATIONS DASHBOARD */}
            <div className="row g-4 mb-4 mt-2">
                <div className="col-12">
                    <h5 className="text-white mb-3"><FaTachometerAlt className="me-2 text-primary"/> Live Operations</h5>
                </div>
                {[
                    { label: "Today's Revenue", val: dashboardData?.todayRevenue || 0, prefix: "Rs. " },
                    { label: "Today's Sales", val: dashboardData?.todaySales || 0, prefix: "" },
                    { label: "Weekly Revenue", val: dashboardData?.weeklyRevenue || 0, prefix: "Rs. " },
                    { label: "Monthly Revenue", val: dashboardData?.monthlyRevenue || 0, prefix: "Rs. " },
                    { label: "Business Health", val: aiData?.businessHealthScore || 0, suffix: "/100" }
                ].map((kpi, idx) => (
                    <div className="col-md" key={idx}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-3 text-center h-100 border-start border-4 border-primary">
                            <small className="text-muted text-uppercase fw-bold" style={{fontSize: '11px'}}>{kpi.label}</small>
                            <h4 className="text-white mt-2 mb-0 fw-bold">
                                {kpi.prefix}
                                <CountUp end={kpi.val} duration={2} separator="," />
                                {kpi.suffix}
                            </h4>
                        </motion.div>
                    </div>
                ))}
            </div>

            <div className="row g-4 mb-4">
                {/* FUEL TANKS (Animated) */}
                <div className="col-md-4">
                    <div className="glass-card p-4 h-100">
                        <h5 className="text-white mb-4"><FaGasPump className="me-2 text-warning"/> Fuel Tanks</h5>
                        
                        <div className="mb-4">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-white fw-bold">Petrol</span>
                                <span className="text-warning fw-bold">{petrol.stock}L ({petrolPct}%)</span>
                            </div>
                            <div className="fuel-tank-container">
                                <motion.div 
                                    className="fuel-liquid bg-warning" 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${petrolPct}%` }} 
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-white fw-bold">Diesel</span>
                                <span className="text-info fw-bold">{diesel.stock}L ({dieselPct}%)</span>
                            </div>
                            <div className="fuel-tank-container">
                                <motion.div 
                                    className="fuel-liquid bg-info" 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${dieselPct}%` }} 
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI EXECUTIVE PANEL */}
                <div className="col-md-8">
                    <div className="glass-card p-4 h-100 border-start border-4 border-info" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(13,202,240,0.05) 100%)' }}>
                        <h5 className="text-white mb-4"><FaRobot className="me-2 text-info"/> AI Executive Panel</h5>
                        <div className="row g-4">
                            <div className="col-md-4">
                                <div className="p-3 bg-dark bg-opacity-50 rounded h-100">
                                    <small className="text-info fw-bold text-uppercase">Summary</small>
                                    <p className="text-white small mt-2 mb-0">{aiData?.dailyBusinessSummary || "Analyzing..."}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 bg-dark bg-opacity-50 rounded h-100">
                                    <small className="text-warning fw-bold text-uppercase">Forecasts</small>
                                    <ul className="text-white small mt-2 mb-0 ps-3">
                                        <li>{aiData?.revenuePrediction || "Revenue N/A"}</li>
                                        <li>{aiData?.fuelDemandPrediction || "Demand N/A"}</li>
                                        <li>Profit: {aiData?.profitAnalysis || "N/A"}</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 bg-dark bg-opacity-50 rounded h-100">
                                    <small className="text-danger fw-bold text-uppercase">Alerts & Actions</small>
                                    <p className="text-danger small mt-2 mb-1 fw-bold">{petrolPct < 20 || dieselPct < 20 ? "⚠ Low Stock Alert!" : "All stocks optimal."}</p>
                                    <p className="text-success small mb-0">Recommendation: {aiData?.businessRecommendations?.[0] || "Maintain operations."}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                {/* LIVE FEED */}
                <div className="col-md-4">
                    <div className="glass-card p-4 h-100 d-flex flex-column">
                        <h5 className="text-white mb-4"><FaClock className="me-2 text-primary"/> Live Activity Feed</h5>
                        <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '300px' }}>
                            <AnimatePresence>
                                {events.map(ev => (
                                    <motion.div key={ev.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-3 border-start border-2 border-primary ps-3">
                                        <small className="text-primary d-block">{ev.time}</small>
                                        <span className="text-white small">{ev.message}</span>
                                    </motion.div>
                                ))}
                                {events.length === 0 && <p className="text-muted small">Listening for events...</p>}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* NOTIFICATION CENTER */}
                <div className="col-md-4">
                    <div className="glass-card p-4 h-100 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="text-white mb-0"><FaBell className="me-2 text-warning"/> Notifications</h5>
                            {notifications.length > 0 && <span className="badge bg-danger rounded-pill">{notifications.length} New</span>}
                        </div>
                        <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '300px' }}>
                            <AnimatePresence>
                                {notifications.map(n => (
                                    <motion.div key={n.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="alert alert-dark bg-opacity-75 border-secondary text-white py-2 px-3 mb-2 d-flex justify-content-between align-items-center">
                                        <div style={{ fontSize: '0.85rem' }}>
                                            <span className="text-warning fw-bold me-2">{n.time}</span>
                                            {n.message}
                                        </div>
                                        <button className="btn-close btn-close-white ms-2" style={{ fontSize: '0.6rem' }} onClick={() => dismissNotification(n.id)}></button>
                                    </motion.div>
                                ))}
                                {notifications.length === 0 && <p className="text-muted small text-center mt-5">No new notifications.</p>}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* SYSTEM HEALTH */}
                <div className="col-md-4">
                    <div className="glass-card p-4 h-100 border-start border-4 border-success">
                        <h5 className="text-white mb-4"><FaServer className="me-2 text-success"/> System Health</h5>
                        <div className="d-flex justify-content-between mb-3 border-bottom border-secondary pb-2">
                            <span className="text-white small">Overall Platform</span>
                            <StatusBadge status={healthData?.status} />
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span className="text-white small">Database (MySQL)</span>
                            <StatusBadge status={sysComponents.db?.status} />
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span className="text-white small">Email Automation</span>
                            <StatusBadge status={sysComponents.email?.status} />
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span className="text-white small">Report Scheduler</span>
                            <StatusBadge status={sysComponents.scheduler?.status} />
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span className="text-white small">Gemini AI</span>
                            <StatusBadge status={sysComponents.ai?.status} />
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span className="text-white small">Disk Space</span>
                            <StatusBadge status={sysComponents.diskSpace?.status} />
                        </div>
                        {sysComponents.diskSpace?.details && (
                            <div className="progress mt-2" style={{ height: '4px' }}>
                                <div className="progress-bar bg-success" style={{ width: '80%' }}></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                {/* REPORT CENTER */}
                <div className="col-md-6">
                    <div className="glass-card p-4 h-100">
                        <h5 className="text-white mb-4"><FaChartBar className="me-2 text-danger"/> Report Center</h5>
                        <div className="d-flex gap-2 mb-4">
                            <button className="btn btn-sm btn-primary flex-grow-1" onClick={() => generateReport('DAILY')}>Generate Daily</button>
                            <button className="btn btn-sm btn-info flex-grow-1" onClick={() => generateReport('WEEKLY')}>Generate Weekly</button>
                            <button className="btn btn-sm btn-warning flex-grow-1" onClick={() => generateReport('MONTHLY')}>Generate Monthly</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover table-sm align-middle mb-0" style={{ background: 'transparent' }}>
                                <thead>
                                    <tr>
                                        <th className="text-muted border-secondary">Type</th>
                                        <th className="text-muted border-secondary">Generated On</th>
                                        <th className="text-muted border-secondary text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportsData.map((r, i) => (
                                        <tr key={i}>
                                            <td className="border-secondary">{r.reportType}</td>
                                            <td className="border-secondary">{new Date(r.generatedAt).toLocaleString()}</td>
                                            <td className="border-secondary text-end">
                                                <a href={`http://localhost:8080/${r.filePath}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light"><FaDownload /></a>
                                            </td>
                                        </tr>
                                    ))}
                                    {reportsData.length === 0 && <tr><td colSpan="3" className="text-muted text-center py-3 border-secondary">No reports generated yet.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* INVOICE CENTER */}
                <div className="col-md-6">
                    <div className="glass-card p-4 h-100">
                        <h5 className="text-white mb-4"><FaFileInvoiceDollar className="me-2 text-success"/> Invoice Center</h5>
                        <p className="text-muted small mb-3">Recent transactions and their associated invoices.</p>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover table-sm align-middle mb-0" style={{ background: 'transparent' }}>
                                <thead>
                                    <tr>
                                        <th className="text-muted border-secondary">Bill No</th>
                                        <th className="text-muted border-secondary">Customer</th>
                                        <th className="text-muted border-secondary">Amount</th>
                                        <th className="text-muted border-secondary text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesData.map((s, i) => (
                                        <tr key={i}>
                                            <td className="border-secondary">{s.billNo}</td>
                                            <td className="border-secondary text-truncate" style={{maxWidth: '120px'}}>{s.customerName || 'Walk-in'}</td>
                                            <td className="border-secondary text-success fw-bold">Rs.{s.totalAmount}</td>
                                            <td className="border-secondary text-end">
                                                {/* Assuming invoice endpoint will exist or PDF can be fetched by BillNo. For now, visual representation */}
                                                <button className="btn btn-sm btn-outline-light" onClick={() => alert('Download Invoice feature coming in Phase 7 implementation')}><FaDownload /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {salesData.length === 0 && <tr><td colSpan="4" className="text-muted text-center py-3 border-secondary">No recent invoices found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx="true">{`
                .fuel-tank-container {
                    height: 12px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
                }
                .fuel-liquid {
                    height: 100%;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(255,255,255,0.5);
                }
            `}</style>
        </div>
    );
}

export default ManagerDashboard;
