import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter Email and Password");
            return;
        }

        try {
            // First try the new Auth flow
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                { email, password }
            );

            if (response.data.token) {
                login(response.data, response.data.token);
                navigate("/dashboard");
            }
        } catch (authError) {
            // If new Auth fails, fallback to legacy login just in case
            try {
                const legacyResponse = await axios.post(
                    "http://localhost:8080/api/login",
                    { email, password }
                );
                if (legacyResponse.data) {
                    login(legacyResponse.data, null);
                    navigate("/dashboard");
                }
            } catch (legacyError) {
                console.error(legacyError);
                if (authError.response && authError.response.data) {
                    setError(authError.response.data.message || authError.response.data.error || "Invalid Credentials");
                } else {
                    setError("Unable to connect to server.");
                }
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" }}>
            <div className="card shadow-lg p-5" style={{ width: "450px", borderRadius: "15px", backgroundColor: "#ffffff" }}>
                <div className="text-center mb-4">
                    <h2 style={{ fontWeight: "700", color: "#333" }}>⛽ FuelStation</h2>
                    <p className="text-muted">Sign in to your account</p>
                </div>

                {error && <div className="alert alert-danger p-2 text-center">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label text-secondary fw-bold">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                                <FiMail className="text-muted" />
                            </span>
                            <input
                                type="email"
                                className="form-control border-start-0 bg-light"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="d-flex justify-content-between">
                            <label className="form-label text-secondary fw-bold">Password</label>
                            <a href="#" className="text-decoration-none small text-primary" onClick={(e) => { e.preventDefault(); alert("Please contact Administrator to reset your password."); }}>Forgot Password?</a>
                        </div>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                                <FiLock className="text-muted" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control border-start-0 border-end-0 bg-light"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span className="input-group-text bg-light border-start-0" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FiEyeOff className="text-muted" /> : <FiEye className="text-muted" />}
                            </span>
                        </div>
                    </div>

                    <div className="mb-4 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="form-check-label text-muted" htmlFor="rememberMe">Remember me for 30 days</label>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-2" style={{ fontWeight: "600", borderRadius: "8px", background: "#2a5298", border: "none" }}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;