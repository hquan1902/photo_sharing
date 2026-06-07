import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  Stack,
  Typography,
  TextField,
  Button
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../lib/fetchModelData";

import "./styles.css";

function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  if (Number.isNaN(date.getTime())) {
    return dateTimeString;
  }

  return date.toLocaleString();
}

function getPhotoSrc(fileName) {
  return `${API_BASE_URL}/images/${fileName}`;
}

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      const token = localStorage.getItem("myToken");
      try {
        const response = await fetch(`${API_BASE_URL}/api/photosOfUser/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        if (!ignore) {
          setPhotos(result);
          setLoading(false);
        }
      }
      catch (err) {
        setError("An error occurred while fetching photos.");
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [userId]);

  const handleCommentChange = (photoId, text) => {
    setNewComments({ ...newComments, [photoId]: text });
  };

  const handleAddComment = async (photoId) => {
    const text = newComments[photoId];
    if (!text || text.trim() === "") return;

    const token = localStorage.getItem("myToken");
    try {
      const response = await fetch(`${API_BASE_URL}/api/commentsOfPhoto/${photoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ comment: text })
      });
      if (response.ok) {
        setNewComments({ ...newComments, [photoId]: "" });
        const response2 = await fetch(`${API_BASE_URL}/api/photosOfUser/${userId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await response2.json();
        setPhotos(result);
      }
    }
    catch (err) {
      console.error("Lỗi khi thêm comment:", err);
    }
  };

  const sortedPhotos = useMemo(
    () =>
      [...photos].sort((a, b) => new Date(b.date_time) - new Date(a.date_time)),
    [photos]
  );

  if (loading) {
    return <Typography variant="body1">Loading photos...</Typography>;
  }

  if (error) {
    return <Typography variant="body1">{error}</Typography>;
  }

  if (sortedPhotos.length === 0) {
    return (
      <Typography variant="body1">No photos found for this user.</Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {sortedPhotos.map((photo) => (
        <Card key={photo._id} variant="outlined">
          <CardMedia
            component="img"
            image={getPhotoSrc(photo.file_name)}
            alt={photo.file_name}
          />
          <CardContent>
            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
              Posted: {formatDateTime(photo.date_time)}
            </Typography>
            <Divider sx={{ mb: 1.5 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Comments
            </Typography>
            {photo.comments && photo.comments.length > 0 ? (
              <Stack spacing={1.25}>
                {photo.comments.map((comment) => (
                  <Stack key={comment._id} spacing={0.3}>
                    <Typography variant="body2">
                      <Link to={`/users/${comment.user_id._id}`}>
                        {comment.user_id.first_name} {comment.user_id.last_name}
                      </Link>
                      {": "}
                      {comment.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(comment.date_time)}
                    </Typography>
                    <Divider />
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2">No comments yet.</Typography>
            )}
            <Divider sx={{ my: 1.5 }} />
            <Stack direction="row" spacing={1}>
              <TextField size="small" fullWidth placeholder="Write a comment..." variant="outlined" value={newComments[photo._id] || ""} onChange={(e) => handleCommentChange(photo._id, e.target.value)} />
              <Button variant="contained" onClick={() => handleAddComment(photo._id)} disabled={!newComments[photo._id] || newComments[photo._id].trim() === ""}>Đăng</Button>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

export default UserPhotos;
