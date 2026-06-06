import './App.css';

import React, { useState, useEffect } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from './components/Auth/LoginRegister';
import ProtectedRouter from './components/Auth/ProtectedRouter';
import { API_BASE_URL } from './lib/fetchModelData';

const App = (props) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("myToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          return {
            _id: decoded.id,
            login_name: decoded.login_name,
            first_name: decoded.first_name,
          };
        } else {
          localStorage.removeItem("myToken");
        }
      } catch (err) {
        console.error("Token lỗi!");
      }
    }
    return null;
  });

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/logout`, {
        method: "POST"
      });
    }
    catch (err) {
      console.error(err);
    }
    localStorage.removeItem("myToken");
    setUser(null);
  }

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar user={user} onLogout={handleLogout} />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              {user ? <UserList /> : <p>Hãy đăng nhập để xem danh sách người dùng.</p>}
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route
                  path="/login"
                  element={
                    user ? <Navigate to="/" replace /> : <LoginRegister onLogin={setUser} />
                  }
                />
                <Route
                  path="/users/:userId"
                  element={<ProtectedRouter user={user}><UserDetail /></ProtectedRouter>}
                />
                <Route
                  path="/photos/:userId"
                  element={<ProtectedRouter user={user}><UserPhotos /></ProtectedRouter>}
                />
                <Route path="/users" element={<ProtectedRouter user={user}><UserList /></ProtectedRouter>} />
                <Route path="/" element={<Navigate to="/users" replace />} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
}

export default App;
