import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
    const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:8080/api/profile');
            setProfile(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:8080/api/profile', profile);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            alert('Failed to update profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        try {
            await axios.put('http://localhost:8080/api/profile/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setMessage('Password changed successfully!');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            alert(err.response?.data || 'Failed to change password');
        }
    };

    return (
        <div className="container mt-4">
            <h2>My Profile</h2>
            {message && <div className="alert alert-success">{message}</div>}

            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">Update Profile</div>
                        <div className="card-body">
                            {loading ? <p>Loading...</p> : (
                                <form onSubmit={handleUpdateProfile}>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" className="form-control" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email (Cannot be changed)</label>
                                        <input type="email" className="form-control" value={profile.email} disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Phone</label>
                                        <input type="text" className="form-control" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mt-4 mt-md-0">
                    <div className="card shadow-sm">
                        <div className="card-header bg-secondary text-white">Change Password</div>
                        <div className="card-body">
                            <form onSubmit={handleChangePassword}>
                                <div className="mb-3">
                                    <label className="form-label">Current Password</label>
                                    <input type="password" className="form-control" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input type="password" className="form-control" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Confirm New Password</label>
                                    <input type="password" className="form-control" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} required />
                                </div>
                                <button type="submit" className="btn btn-secondary">Update Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
