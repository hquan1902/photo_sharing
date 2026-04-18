import React, { useEffect, useState } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

import "./styles.css";

function UserList () {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      let ignore = false;

      const fetchData = async () => {
        try {
          const result = await fetchModel("/api/user/list");
          if (!ignore) {
            setUsers(result);
            setLoading(false);
            setError(null);
          }
        } 
        catch (err) {
          if(!ignore){
            console.error("[UserList] Failed to fetch users:", err)
            setError("An error occurred while fetching users.");
            setLoading(false);
          }
        }
      };
      fetchData();

      return () => {
        ignore = true;
      };
    }, []);

    if (loading) {
      return <Typography variant="body1">Loading users...</Typography>;
    }

    if (error) {
      return <Typography variant="body1">{error}</Typography>;
    }

    return (
      <div>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Users:
        </Typography>
        <List component="nav">
          {users.map((user) => (
            <React.Fragment key={user._id}>
              <ListItem disablePadding>
                <ListItemButton component={Link} to={`/users/${user._id}`}>
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`}
                  />
                </ListItemButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </div>
    );
}

export default UserList;
