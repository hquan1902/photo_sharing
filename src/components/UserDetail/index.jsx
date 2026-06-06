import React, { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../lib/fetchModelData";

import "./styles.css";


function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      const token = localStorage.getItem("myToken");
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        if (!ignore) {
          setUser(result);
          setLoading(false);
        }
      }
      catch (err) {
        setError("An error occurred while fetching user details.");
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <Typography variant="body1">Loading user...</Typography>;
  }

  if (error) {
    return <Typography variant="body1">{error}</Typography>;
  }

  return (
    <Stack spacing={1.25}>
      <Typography variant="h5">
        {user.first_name} {user.last_name}
      </Typography>
      <Typography variant="body1">
        <strong>Location:</strong> {user.location}
      </Typography>
      <Typography variant="body1">
        <strong>Occupation:</strong> {user.occupation}
      </Typography>
      <Typography variant="body1">
        <strong>Description:</strong> {user.description}
      </Typography>
      <Button
        component={Link}
        to={`/photos/${user._id}`}
        variant="outlined"
        sx={{ width: "fit-content", mt: 1 }}
      >
        View Photos
      </Button>
    </Stack>
  );
}

export default UserDetail;
