import React, { useEffect, useMemo, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { matchPath, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../lib/fetchModelData";

import "./styles.css";

function TopBar({ user, onLogout }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  const userDetailMatch = matchPath("/users/:userId", location.pathname);
  const userPhotosMatch = matchPath("/photos/:userId", location.pathname);
  const userId =
    userDetailMatch?.params?.userId || userPhotosMatch?.params?.userId;

  useEffect(() => {
    let ignore = false;

    if (!userId) {
      setCurrentUser(null);
      setError(null);
      return () => {
        ignore = true;
      };
    }

    const fetchData = async () => {
      const token = localStorage.getItem("myToken");
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (!ignore) {
          setCurrentUser(result);
          setError(null);
        }
      }
      catch (err) {
        if (!ignore) {
          console.error("[TopBar] Failed to fetch user context:", { userId, error: err });
          setCurrentUser(null);
          setError("Unable to load user context");
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [userId]);

  const rightText = useMemo(() => {
    if (!userId) {
      return "Users";
    }
    const fullName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : error ? "User" : "Loading...";

    if (location.pathname.startsWith("/photos")) {
      return `Photos of ${fullName}`;
    }

    return fullName;
  }, [currentUser, error, location.pathname, userId]);

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Typography variant="h5" color="inherit">
                Hi {user.first_name}
              </Typography>
              <Button color="error" variant="contained" onClick={onLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Typography variant="h6" color="inherit">
              Please login
            </Typography>
          )}
        </div>
        <div>
          {user && (
            <Typography variant="h5" color="inherit">
              {rightText}
            </Typography>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
