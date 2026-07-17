import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaServer, FaDatabase, FaRobot, FaEnvelope, FaClock, FaHdd } from 'react-icons/fa';

function SystemHealth() {
    const [healthData, setHealthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 30000); // refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchHealth = async () => {
        try {
            // By default spring boot actuator health endpoint is accessible without auth if configured so, 
            // but we might need to pass token since we secured everything. The interceptor does this.
            const res = await axios.get('http://localhost:8080/actuator/health');
            setHealthData(res.data);
            setError('');
            setLoading(false);
        } catch (err) {
            console.error(err);
            // Sometimes actuator returns 503 if one component is down, we can still parse the response
            if (err.response && err.response.data) {
                setHealthData(err.response.data);
                setError('');
            } else {
                setError('Failed to fetch system health data.');
            }
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        const color = status === 'UP' ? 'success' : (status === 'OUT_OF_SERVICE' || status === 'DOWN' ? 'danger' : 'warning');
        return <span className={`badge bg-${color} px-3 py-2 fs-6`}>{status}</span>;
    };

    if (loading) return <div className="p-4">Loading System Health...</div>;

    const components = healthData?.components || {};

    return (
        <div className="container mt-4 pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>System Health</h2>
                <div>
                    <strong>Overall Status: </strong> 
                    <StatusBadge status={healthData?.status} />
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-4">
                {/* Database Status */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body text-center">
                            <FaDatabase size={40} className="text-primary mb-3" />
                            <h5>Database</h5>
                            <div className="mb-2">
                                <StatusBadge status={components.db?.status || 'UNKNOWN'} />
                            </div>
                            <small className="text-muted">{components.db?.details?.database || 'MySQL'}</small>
                        </div>
                    </div>
                </div>

                {/* Disk Space Status */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body text-center">
                            <FaHdd size={40} className="text-secondary mb-3" />
                            <h5>Disk Space</h5>
                            <div className="mb-2">
                                <StatusBadge status={components.diskSpace?.status || 'UNKNOWN'} />
                            </div>
                            {components.diskSpace?.details && (
                                <small className="text-muted">
                                    Free: {(components.diskSpace.details.free / (1024 * 1024 * 1024)).toFixed(2)} GB
                                </small>
                            )}
                        </div>
                    </div>
                </div>

                {/* Application Ping */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body text-center">
                            <FaServer size={40} className="text-success mb-3" />
                            <h5>App Server</h5>
                            <div className="mb-2">
                                <StatusBadge status={components.ping?.status || 'UNKNOWN'} />
                            </div>
                            <small className="text-muted">Backend API</small>
                        </div>
                    </div>
                </div>

                {/* AI Status */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body text-center">
                            <FaRobot size={40} className="text-info mb-3" />
                            <h5>AI Assistant</h5>
                            <div className="mb-2">
                                <StatusBadge status={components.ai?.status || 'UNKNOWN'} />
                            </div>
                            <small className="text-muted">{components.ai?.details?.error || 'Gemini Integration'}</small>
                        </div>
                    </div>
                </div>

                {/* Email Status */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body text-center">
                            <FaEnvelope size={40} className="text-warning mb-3" />
                            <h5>Email Service</h5>
                            <div className="mb-2">
                                <StatusBadge status={components.email?.status || 'UNKNOWN'} />
                            </div>
                            <small className="text-muted">{components.email?.details?.error || components.email?.details?.host || 'SMTP'}</small>
                        </div>
                    </div>
                </div>

                {/* Scheduler Status */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body text-center">
                            <FaClock size={40} className="text-danger mb-3" />
                            <h5>Task Scheduler</h5>
                            <div className="mb-2">
                                <StatusBadge status={components.scheduler?.status || 'UNKNOWN'} />
                            </div>
                            <small className="text-muted">Automated Reports & Backups</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SystemHealth;
