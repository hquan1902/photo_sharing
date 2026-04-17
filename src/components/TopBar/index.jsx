import React, { useEffect, useMemo, useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { matchPath, useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import models from "../../modelData/models";

import "./styles.css";

function TopBar() {
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
      try {
        const result = await fetchModel(`/user/${userId}`);
        if (!ignore) {
          setCurrentUser(result);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          const fallbackUser = models.userModel(userId);
          if (fallbackUser) {
            setCurrentUser(fallbackUser);
            setError(null);
          } else {
            setCurrentUser(null);
            setError("Unable to load user context");
          }
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
    const fullName = currentUser
      ? `${currentUser.first_name} ${currentUser.last_name}`
      : error
      ? "User"
      : "Loading...";

    if (location.pathname.startsWith("/photos")) {
      return `Photos of ${fullName}`;
    }

    return fullName;
  }, [currentUser, error, location.pathname, userId]);

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color="inherit">
          Nguyễn Hữu Quân
        </Typography>
        <Typography variant="h6" color="inherit">
          {rightText}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
