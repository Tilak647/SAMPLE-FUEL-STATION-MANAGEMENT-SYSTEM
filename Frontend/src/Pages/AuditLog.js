import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AuditLog() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:8080/api/audit-logs');
            setLogs(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => 
        (log.userName && log.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.module && log.module.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container mt-4">
            <h2>Audit Logs</h2>
            <div className="mb-3 mt-4">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search by User, Action, or Module..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                />
            </div>

            {loading ? <p>Loading logs...</p> : (
                <div className="table-responsive bg-white rounded shadow-sm">
                    <table className="table table-hover mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Module</th>
                                <th>IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map(log => (
                                <tr key={log.id}>
                                    <td>{log.date}</td>
                                    <td>{log.time}</td>
                                    <td>{log.userName}</td>
                                    <td>{log.action}</td>
                                    <td>{log.module}</td>
                                    <td>{log.ipAddress}</td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">No audit logs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AuditLog;
