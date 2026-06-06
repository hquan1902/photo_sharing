import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../lib/fetchModelData";

export default function LoginRegister({ onLogin }) {
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);

    const [loginName, setLoginName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [occupation, setOccupation] = useState("");

    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ login_name: loginName, password: password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("myToken", data.token);
                onLogin && onLogin(data.user);
                navigate("/");
            }
            else {
                setError(data.message || "Tên đăng nhập hoặc mật khẩu không đúng!");
            }
        }
        catch (err) {
            console.error("Lỗi đăng nhập:", err);
            setError("Lỗi kết nối đến máy chủ!");
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        if (password !== confirmPassword) {
            console.log("Mật khẩu nhập lại không khớp!");
            setError("Mật khẩu nhập lại không khớp!");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/user`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    login_name: loginName,
                    password: password,
                    first_name: firstName,
                    last_name: lastName,
                    location: location,
                    description: description,
                    occupation: occupation,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                setSuccessMsg("Đăng ký thành công! Hãy đăng nhập.");
                setIsLoginMode(true);
                setPassword("");
                setConfirmPassword("");
            }
            else {
                setError(data.message || "Đăng ký thất bại!");
            }
        }
        catch (err) {
            console.error("Lỗi đăng ký:", err);
            setError("Lỗi kết nối đến máy chủ!");
        }
    }

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h2 style={{ textAlign: "center" }}>
                {isLoginMode ? "Đăng nhập" : "Đăng ký tài khoản"}
            </h2>
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
            {successMsg && <p style={{ color: "green", textAlign: "center" }}>{successMsg}</p>}

            {isLoginMode ? (
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <label htmlFor="loginName">Username:</label><br />
                    <input type="text" placeholder="Nhập tên đăng nhập..." required id="loginName" value={loginName} onChange={(e) => setLoginName(e.target.value)} style={{ padding: "10px" }} /><br />
                    <label htmlFor="password">Password:</label><br />
                    <input type="password" placeholder="Nhập mật khẩu..." required id="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "10px" }} /><br />
                    <button type="submit" style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }}>Login</button>
                </form>
            ) : (
                <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input type="text" placeholder="First name..." required value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ padding: "10px" }} />
                    <input type="text" placeholder="Last name..." required value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ padding: "10px" }} />
                    <input type="text" placeholder="Location..." required value={location} onChange={(e) => setLocation(e.target.value)} style={{ padding: "10px" }} />
                    <input type="text" placeholder="Occupation..." value={occupation} onChange={(e) => setOccupation(e.target.value)} style={{ padding: "10px" }} />
                    <textarea placeholder="Mô tả bản thân (Description)..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: "10px" }} />
                    <input type="text" placeholder="Username..." required value={loginName} onChange={(e) => setLoginName(e.target.value)} style={{ padding: "10px" }} />
                    <input type="password" placeholder="Password..." required value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "10px" }} />
                    <input type="password" placeholder="Confirm password..." required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ padding: "10px" }} />
                    <button type="submit" style={{ padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }}>Sign up</button>
                </form>
            )}

            <div style={{}}>
                {isLoginMode ? (
                    <p>Chưa có tài khoản? <span style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }} onClick={() => setIsLoginMode(false)}>Đăng ký ngay</span></p>
                ) : (
                    <p>Đã có tài khoản? <span style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }} onClick={() => setIsLoginMode(true)}>Đăng nhập</span></p>
                )}
            </div>
        </div>
    );
}