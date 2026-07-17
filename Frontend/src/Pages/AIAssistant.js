import ChatBox from "../Comp/ChatBox";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import PageHeader from "../Comp/PageHeader";
import {
    FaRobot,
    FaCheckCircle,
    FaChartLine,
    FaLightbulb,
    FaBatteryHalf,
    FaSpinner,
    FaTachometerAlt,
    FaCoins
} from "react-icons/fa";
import "../Style/EnterpriseTheme.css";

function AIAssistant(){
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [aiData, setAiData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAIIntelligence();
    }, []);

    const fetchAIIntelligence = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/api/ai/intelligence");
            setAiData(response.data);
        } catch (error) {
            console.error("Error fetching AI Intelligence", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid mt-4 px-4">
            
            <div className="d-flex justify-content-between align-items-center">
                <PageHeader
                    title="🤖 AI Intelligence Hub"
                    subtitle="Interact with Gemini AI for real-time insights, analytics, and business recommendations."
                />
                <button 
                    className="btn btn-outline-primary" 
                    onClick={fetchAIIntelligence}
                    disabled={loading}
                >
                    {loading ? <><FaSpinner className="fa-spin me-2"/> Analyzing Live DB...</> : 'Refresh AI Analysis'}
                </button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <FaSpinner className="fa-spin text-primary" size={50} />
                    <h5 className="mt-3 text-muted">Gemini AI is analyzing your live business data...</h5>
                </div>
            ) : aiData ? (
                <>
                    {/* Top Level KPIs */}
                    <div className="row g-4 mb-4">
                        <div className="col-md-3">
                            <motion.div whileHover={{ y: -5 }} className="glass-card p-4 h-100 text-center" style={{ borderTop: '4px solid #10B981' }}>
                                <FaTachometerAlt size={30} color="#10B981" className="mb-2" />
                                <h6 className="text-muted text-uppercase fw-bold">Business Health</h6>
                                <h1 className="text-white mb-0">{aiData.businessHealthScore}<span className="text-muted fs-5">/100</span></h1>
                            </motion.div>
                        </div>
                        <div className="col-md-3">
                            <motion.div whileHover={{ y: -5 }} className="glass-card p-4 h-100 text-center" style={{ borderTop: '4px solid #F59E0B' }}>
                                <FaChartLine size={30} color="#F59E0B" className="mb-2" />
                                <h6 className="text-muted text-uppercase fw-bold">Revenue Growth</h6>
                                <h2 className="text-white mb-0">{aiData.revenueGrowthPct > 0 ? '+' : ''}{aiData.revenueGrowthPct}%</h2>
                            </motion.div>
                        </div>
                        <div className="col-md-3">
                            <motion.div whileHover={{ y: -5 }} className="glass-card p-4 h-100 text-center" style={{ borderTop: '4px solid #3B82F6' }}>
                                <FaCoins size={30} color="#3B82F6" className="mb-2" />
                                <h6 className="text-muted text-uppercase fw-bold">Best Selling</h6>
                                <h2 className="text-white mb-0">{aiData.bestSellingFuel}</h2>
                            </motion.div>
                        </div>
                        <div className="col-md-3">
                            <motion.div whileHover={{ y: -5 }} className="glass-card p-4 h-100 text-center" style={{ borderTop: '4px solid #8B5CF6' }}>
                                <FaCheckCircle size={30} color="#8B5CF6" className="mb-2" />
                                <h6 className="text-muted text-uppercase fw-bold">Peak Hours</h6>
                                <h5 className="text-white mb-0 mt-2">{aiData.peakBusinessHours}</h5>
                            </motion.div>
                        </div>
                    </div>

                    {/* AI Insight Cards */}
                    <div className="row g-4 mb-5">
                        <div className="col-md-4">
                            <motion.div whileHover={{ y: -5 }} className="glass-card p-4 h-100" style={{ borderLeft: '4px solid #8B5CF6' }}>
                                <div className="d-flex align-items-center mb-3">
                                    <FaLightbulb size={24} color="#8B5CF6" className="me-2" />
                                    <h5 className="text-white mb-0">Executive Summary</h5>
                                </div>
                                <p className="text-muted small mb-0">
                                    {aiData.aiExecutiveSummary || aiData.dailyBusinessSummary}
                                </p>
                            </motion.div>
                        </div>

                        <div className="col-md-4">
                            <motion.div whileHover={{ y: -5 }} className="glass-card p-4 h-100" style={{ borderLeft: '4px solid #10B981' }}>
                                <div className="d-flex align-items-center mb-3">
                                    <FaChartLine size={24} color="#10B981" className="me-2" />
                                    <h5 className="text-white mb-0">Profit & Predictions</h5>
                                </div>
                                <ul className="text-muted small mb-0 ps-3">
                                    <li><strong>Profit:</strong> {aiData.profitAnalysis}</li>
                                    <li className="mt-2"><strong>Revenue Pred:</strong> {aiData.revenuePrediction}</li>
                                    <li className="mt-2"><strong>Demand Pred:</strong> {aiData.fuelDemandPrediction}</li>
                                </ul>
                            </motion.div>
                        </div>

                        <div className="col-md-4">
                            <motion.div whileHover={{ y: -5 }} className="glass-card p-4 h-100" style={{ borderLeft: '4px solid #F59E0B' }}>
                                <div className="d-flex align-items-center mb-3">
                                    <FaBatteryHalf size={24} color="#F59E0B" className="me-2" />
                                    <h5 className="text-white mb-0">Stock & Refill Suggestion</h5>
                                </div>
                                <ul className="text-muted small mb-0 ps-3">
                                    <li><strong>Petrol Refill:</strong> {aiData.petrolRefillPrediction}</li>
                                    <li className="mt-2"><strong>Diesel Refill:</strong> {aiData.dieselRefillPrediction}</li>
                                    <li className="mt-2"><strong>Consumption:</strong> {aiData.fuelConsumptionTrend}</li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                    
                    {/* Recommendations List */}
                    <div className="row g-4 mb-5">
                        <div className="col-12">
                            <div className="glass-card p-4 border-start border-4 border-info">
                                <h5 className="text-white mb-3">🚀 Gemini AI Business Recommendations</h5>
                                <div className="row">
                                    {aiData.businessRecommendations && aiData.businessRecommendations.length > 0 ? (
                                        aiData.businessRecommendations.map((rec, idx) => (
                                            <div className="col-md-6 mb-2" key={idx}>
                                                <div className="d-flex align-items-start">
                                                    <FaCheckCircle className="text-info mt-1 me-2" />
                                                    <p className="text-muted mb-0">{rec}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted ms-3">No specific recommendations at this time.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="alert alert-danger text-center">Failed to load AI Intelligence. Please try again.</div>
            )}

            <div className="row g-4">
                {/* Suggested Questions */}
                <div className="col-md-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4 h-100">
                        <div className="d-flex align-items-center mb-4">
                            <FaRobot size={24} className="text-primary me-2" />
                            <h5 className="text-white mb-0">Ask Gemini AI</h5>
                        </div>
                        <p className="text-muted small mb-4">Click a prompt below to instantly ask the AI assistant for specific business data.</p>
                        
                        <div className="d-flex flex-column gap-2">
                            <button className="btn btn-outline-primary text-start w-100 p-2" onClick={() => setSelectedQuestion("Give me a comprehensive business summary of today's operations.")}>
                                📝 Business Summary
                            </button>
                            <button className="btn btn-outline-success text-start w-100 p-2" onClick={() => setSelectedQuestion("Analyze my current fuel stock and provide refill dates.")}>
                                🛢️ Stock Analysis
                            </button>
                            <button className="btn btn-outline-warning text-start w-100 p-2" onClick={() => setSelectedQuestion("Provide a detailed revenue analysis for the past week.")}>
                                📈 Revenue Analysis
                            </button>
                            <button className="btn btn-outline-info text-start w-100 p-2" onClick={() => setSelectedQuestion("What is the projected growth analysis for this month?")}>
                                🚀 Growth Analysis
                            </button>
                            <button className="btn btn-outline-danger text-start w-100 p-2" onClick={() => setSelectedQuestion("Identify any operational bottlenecks or low stock alerts.")}>
                                ⚠️ System Alerts
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Chat Interface */}
                <div className="col-md-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-0 h-100 d-flex flex-column" style={{ minHeight: '500px' }}>
                        <div className="card-header bg-transparent border-bottom border-secondary p-4 d-flex justify-content-between align-items-center">
                            <h5 className="text-white mb-0">💬 Live AI Chat</h5>
                            <span className="badge badge-success"><FaCheckCircle className="me-1" /> Gemini Connected</span>
                        </div>
                        <div className="card-body p-4 flex-grow-1 d-flex flex-column">
                            <ChatBox selectedQuestion={selectedQuestion} />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default AIAssistant;