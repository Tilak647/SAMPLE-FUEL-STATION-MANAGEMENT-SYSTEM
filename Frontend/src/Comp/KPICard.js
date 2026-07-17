import React from "react";
import { motion } from "framer-motion";
import "../Style/EnterpriseTheme.css"; // Ensure global classes are available

function KPICard({ title, value, icon, colorClass }) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`glass-card p-4 h-100 ${colorClass || ""}`}
        >
            <div className="d-flex justify-content-between align-items-center h-100">
                <div>
                    <h6 className="text-muted text-uppercase fw-bold mb-2" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>
                        {title}
                    </h6>
                    <h2 className="mb-0 fw-bold text-white">
                        {value}
                    </h2>
                </div>
                <div 
                    className="icon-container d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(5px)'
                    }}
                >
                    {React.cloneElement(icon, { size: 30, className: "text-white" })}
                </div>
            </div>
        </motion.div>
    );
}

export default KPICard;