import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'OPERATOR', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:8080/api/users');
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/users', newUser);
            setNewUser({ name: '', email: '', password: '', role: 'OPERATOR', phone: '' });
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert(err.response?.data || 'Failed to create user');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:8080/api/users/${id}`);
                fetchUsers();
            } catch (err) {
                console.error(err);
                alert('Failed to delete user');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>User Management</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white">Create New User</div>
                <div className="card-body">
                    <form onSubmit={handleCreateUser}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <input type="text" className="form-control" placeholder="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required />
                            </div>
                            <div className="col-md-4">
                                <input type="email" className="form-control" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
                            </div>
                            <div className="col-md-4">
                                <input type="password" className="form-control" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
                            </div>
                            <div className="col-md-4">
                                <input type="text" className="form-control" placeholder="Phone" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} />
                            </div>
                            <div className="col-md-4">
                                <select className="form-select" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                                    <option value="ADMIN">Admin</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="OPERATOR">Operator</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <button type="submit" className="btn btn-success w-100">Create User</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {loading ? <p>Loading users...</p> : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <span className={`badge ${user.active ? 'bg-success' : 'bg-danger'}`}>
                                            {user.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                        {/* Edit functionality could be added in a modal */}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && <tr><td colSpan="6" className="text-center">No users found</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default UserManagement;
