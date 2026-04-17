import React, { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import models from "../../modelData/models";

import "./styles.css";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const result = await fetchModel(`/user/${userId}`);
        if (!ignore) {
          setUser(result);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          const fallbackUser = models.userModel(userId);
          if (fallbackUser) {
            setUser(fallbackUser);
            setError(null);
          } else {
            setError("An error occurred while fetching user details.");
          }
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
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
