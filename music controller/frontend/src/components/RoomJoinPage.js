// Roomjoinpage is the page where the user can join a room

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typography, TextField, Button, Grid } from "@mui/material";

export default function RoomJoinPage() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate(); // Use the useNavigate hook for navigation

  const handleRoomCodeChange = (e) => {
    setRoomCode(e.target.value);
    setError(false);
  };

  const handleJoinRoom = () => {
    // Implement your logic for joining the room her
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: roomCode,
      }),
    };
    fetch("/api/join-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          console.log("ok");
          navigate("/room/" + roomCode); // Use navigate function to navigate
        } else {
          setError(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="center">
      <div className="typography">
        <Typography component="h4" variant="h4">
          Join a Room
        </Typography>
      </div>
      <div className="typography">
        <TextField
          error={error}
          label="Code"
          placeholder="Enter the Room Code"
          value={roomCode}
          onChange={handleRoomCodeChange}
          helperText={error ? "Invalid room code" : ""}
          variant="outlined"
        />
      </div>

      <div className="button">
        <Grid item xs={12} align="center" className="button">
          <Button onClick={handleJoinRoom} color="primary" variant="contained">
            Enter Room
          </Button>
        </Grid>
        <></>

        <Grid item xs={12} align="center" className="button">
          <Button color="secondary" variant="contained" component={Link} to="/">
            Back
          </Button>
        </Grid>
      </div>
    </div>
  );
}
