import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "../Style/EnterpriseTheme.css";

function TopNavbar() {
    const user = JSON.parse(localStorage.getItem("user")) || { name: "Admin" };
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notifications, setNotifications] = useState([
        { id: '1', message: 'System Initialized', time: new Date() }
    ]);
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const eventSource = new EventSource("http://localhost:8080/api/events/stream");
        
        eventSource.onmessage = (event) => {
            const newEvent = {
                id: Date.now().toString(),
                message: event.data,
                time: new Date()
            };
            setNotifications(prev => [newEvent, ...prev].slice(0, 10)); // Keep last 10
        };

        return () => {
            eventSource.close();
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.length;

    return (
        <div className="enterprise-navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', position: 'sticky', top: 0, zIndex: 100 }}>
            <div>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Dashboard</h2>
                <small style={{ color: 'var(--text-muted)' }}>
                    {currentTime.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </small>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" placeholder="Search..." style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '10px 10px 10px 35px', borderRadius: '8px', outline: 'none', width: '250px' }} />
                </div>
                
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <div style={{ cursor: 'pointer', padding: '8px' }} onClick={() => setShowNotifications(!showNotifications)}>
                        <FaBell size={22} color="var(--text-muted)" className="hover-text-white transition-colors" />
                        {unreadCount > 0 && (
                            <span style={{ position: 'absolute', top: '0px', right: '0px', background: 'var(--color-danger)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '50%', fontWeight: 'bold' }}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>

                    {/* Notification Dropdown */}
                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="glass-card shadow-lg"
                                style={{ position: 'absolute', right: 0, top: '45px', width: '320px', maxHeight: '400px', overflowY: 'auto', zIndex: 1000 }}
                            >
                                <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0 text-white">Live Notifications</h6>
                                    <span className="badge badge-primary">{unreadCount} New</span>
                                </div>
                                <div className="list-group list-group-flush">
                                    {notifications.length > 0 ? notifications.map((notif) => (
                                        <div key={notif.id} className="list-group-item bg-transparent border-bottom border-secondary py-3">
                                            <p className="mb-1 text-white small fw-500">{notif.message}</p>
                                            <small className="text-muted" style={{ fontSize: '11px' }}>
                                                {notif.time.toLocaleTimeString()}
                                            </small>
                                        </div>
                                    )) : (
                                        <div className="p-4 text-center text-muted small">
                                            No recent notifications
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                    <img src={`https://ui-avatars.com/api/?name=${user.name}&background=2563eb&color=fff`} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    <span style={{ fontWeight: '500', color: 'white' }}>{user.name}</span>
                </div>
            </div>
        </div>
    );
}

export default TopNavbar;