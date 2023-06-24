// Room.js is the component that is responsible for rendering the room page. It is responsible for fetching the room details from the backend and rendering the settings button. It also renders the CreateRoomPage and UpdateRoomPage components.
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";
import UpdateRoomPage from "./UpdateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default function Room({ leaveRoomCallback }) {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [song, setSong] = useState({});

  useEffect(() => {
    getRoomDetails(roomCode);
    // getCurrentSong();
    const interval = setInterval(() => {
      getCurrentSong();
    }, 1000);
    return () => clearInterval(interval);
  }, [roomCode]);

  const getRoomDetails = (roomCode) => {
    fetch("/api/get-room" + "?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
          leaveRoomCallback();
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
        if (data.is_host) {
          authenticateSpotify();
        }
      });
  };

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setSong(data);
      });
  };

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      leaveRoomCallback();
      navigate("/");
    });
  };

  const updateShowSettings = (value) => {
    setShowSettings(value);
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <UpdateRoomPage roomCode={roomCode} />
        </Grid>

        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderSettingsButton = () => {
    const handleClick = () => {
      navigate(`/update-room/${roomCode}`);
    };

    return (
      <Grid item xs={12} align="center">
        <Button variant="contained" color="primary" onClick={handleClick}>
          Settings
        </Button>
      </Grid>
    );
  };

  return (
    <>
      <div>
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <Typography variant="h4" component="h4">
              Code: {roomCode}
            </Typography>
          </Grid>
        </Grid>

        {/* Display song details */}
        <MusicPlayer song={song} />
        {/* <MusicPlayer2 song={song} /> */}

        {isHost ? renderSettingsButton() : null}

        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <Button
              color="secondary"
              variant="contained"
              onClick={leaveButtonPressed}
            >
              Leave Room
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

Room.propTypes = {
  leaveRoomCallback: PropTypes.func.isRequired,
};
