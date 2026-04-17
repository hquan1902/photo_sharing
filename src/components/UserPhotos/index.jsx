import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import models from "../../modelData/models";

import "./styles.css";
import kenobi1 from "../../images/kenobi1.jpg";
import kenobi2 from "../../images/kenobi2.jpg";
import kenobi3 from "../../images/kenobi3.jpg";
import kenobi4 from "../../images/kenobi4.jpg";
import ludgate1 from "../../images/ludgate1.jpg";
import malcolm1 from "../../images/malcolm1.jpg";
import malcolm2 from "../../images/malcolm2.jpg";
import ouster from "../../images/ouster.jpg";
import ripley1 from "../../images/ripley1.jpg";
import ripley2 from "../../images/ripley2.jpg";
import took1 from "../../images/took1.jpg";
import took2 from "../../images/took2.jpg";

const photoMap = {
  "kenobi1.jpg": kenobi1,
  "kenobi2.jpg": kenobi2,
  "kenobi3.jpg": kenobi3,
  "kenobi4.jpg": kenobi4,
  "ludgate1.jpg": ludgate1,
  "malcolm1.jpg": malcolm1,
  "malcolm2.jpg": malcolm2,
  "ouster.jpg": ouster,
  "ripley1.jpg": ripley1,
  "ripley2.jpg": ripley2,
  "took1.jpg": took1,
  "took2.jpg": took2,
};

function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  if (Number.isNaN(date.getTime())) {
    return dateTimeString;
  }

  return date.toLocaleString();
}

function getPhotoSrc(fileName) {
  return photoMap[fileName] || "";
}

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const result = await fetchModel(`/photosOfUser/${userId}`);
        if (!ignore) {
          setPhotos(result);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          const fallbackPhotos = models.photoOfUserModel(userId);
          if (fallbackPhotos) {
            setPhotos(fallbackPhotos);
            setError(null);
          } else {
            setError("An error occurred while fetching photos.");
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
                      <Link to={`/users/${comment.user._id}`}>
                        {comment.user.first_name} {comment.user.last_name}
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
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

export default UserPhotos;
