import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import PageHeader from "../Comp/PageHeader";
import { FaFilePdf, FaDownload, FaEnvelope, FaCalendarDay, FaCalendarWeek, FaCalendarAlt, FaCheckCircle, FaSpinner } from "react-icons/fa";
import "../Style/EnterpriseTheme.css";

function Reports() {
    const [history, setHistory] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingType, setLoadingType] = useState("");

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/report/history");
            setHistory(response.data);
        } catch (error) {
            console.error("Error fetching report history:", error);
        }
    };

    const generateReport = async (type) => {
        setIsGenerating(true);
        setLoadingType(type);
        try {
            await axios.post(`http://localhost:8080/api/report/generate?type=${type}`);
            alert(`${type} Report generated successfully!`);
            fetchHistory();
        } catch (error) {
            console.error(`Error generating ${type} report:`, error);
            alert("Error generating report. Please check backend logs.");
        } finally {
            setIsGenerating(false);
            setLoadingType("");
        }
    };

    const downloadReport = async (id, fileName) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/report/download/${id}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || `report_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error downloading report:", error);
            alert("Failed to download report.");
        }
    };

    return (
        <div className="container-fluid mt-4 px-4">
            <PageHeader
                title="📊 Advanced Reports & Analytics"
                subtitle="Generate, track, and download comprehensive business reports."
            />

            <div className="row g-4 mb-4">
                {/* Generate Daily Report */}
                <div className="col-md-4">
                    <motion.div whileHover={{ y: -5 }} className="glass-card text-center p-4 h-100 border-start border-info border-4">
                        <FaCalendarDay size={40} className="text-info mb-3" />
                        <h5 className="text-white">Daily Report</h5>
                        <p className="text-muted small mb-4">Summary of today's sales and inventory updates.</p>
                        <button 
                            className="btn btn-outline-info w-100" 
                            onClick={() => generateReport("DAILY")}
                            disabled={isGenerating}
                        >
                            {loadingType === "DAILY" ? <FaSpinner className="fa-spin me-2" /> : "Generate Daily"}
                        </button>
                    </motion.div>
                </div>

                {/* Generate Weekly Report */}
                <div className="col-md-4">
                    <motion.div whileHover={{ y: -5 }} className="glass-card text-center p-4 h-100 border-start border-warning border-4">
                        <FaCalendarWeek size={40} className="text-warning mb-3" />
                        <h5 className="text-white">Weekly Report</h5>
                        <p className="text-muted small mb-4">7-day analysis of revenue, consumption and growth.</p>
                        <button 
                            className="btn btn-outline-warning w-100" 
                            onClick={() => generateReport("WEEKLY")}
                            disabled={isGenerating}
                        >
                            {loadingType === "WEEKLY" ? <FaSpinner className="fa-spin me-2" /> : "Generate Weekly"}
                        </button>
                    </motion.div>
                </div>

                {/* Generate Monthly Report */}
                <div className="col-md-4">
                    <motion.div whileHover={{ y: -5 }} className="glass-card text-center p-4 h-100 border-start border-primary border-4">
                        <FaCalendarAlt size={40} className="text-primary mb-3" />
                        <h5 className="text-white">Monthly Report</h5>
                        <p className="text-muted small mb-4">Complete 30-day overview for accounting and audit.</p>
                        <button 
                            className="btn btn-outline-primary w-100" 
                            onClick={() => generateReport("MONTHLY")}
                            disabled={isGenerating}
                        >
                            {loadingType === "MONTHLY" ? <FaSpinner className="fa-spin me-2" /> : "Generate Monthly"}
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Report History */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="text-white mb-0">Report Generation History</h5>
                    <button className="btn btn-sm btn-outline-light" onClick={fetchHistory}>Refresh History</button>
                </div>
                
                <div className="table-responsive">
                    <table className="enterprise-table">
                        <thead>
                            <tr>
                                <th>Report ID</th>
                                <th>Type</th>
                                <th>Generated Date</th>
                                <th>Email Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? (
                                history.map((report) => (
                                    <tr key={report.id}>
                                        <td className="fw-bold text-white">#{report.id}</td>
                                        <td>
                                            <span className={`badge ${
                                                report.reportType === 'DAILY' ? 'badge-info' : 
                                                report.reportType === 'WEEKLY' ? 'badge-warning' : 'badge-primary'
                                            }`} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                                {report.reportType}
                                            </span>
                                        </td>
                                        <td className="text-muted">
                                            {report.generatedDate ? new Date(report.generatedDate).toLocaleString() : 'N/A'}
                                        </td>
                                        <td>
                                            {report.emailSent ? (
                                                <span className="text-success"><FaCheckCircle className="me-1"/> Sent</span>
                                            ) : (
                                                <span className="text-warning"><FaSpinner className="me-1"/> Pending</span>
                                            )}
                                        </td>
                                        <td className="text-end">
                                            <button 
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => downloadReport(report.id, report.filePath)}
                                                title="Download PDF"
                                            >
                                                <FaDownload className="me-1"/> Download
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted py-4">No report history found. Generate a report above.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}

export default Reports;