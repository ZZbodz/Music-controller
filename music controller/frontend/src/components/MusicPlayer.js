import React from "react";
import {
  Grid,
  Button,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { PlayArrow, SkipNext, Pause } from "@mui/icons-material";

export default function MusicPlayer({ song }) {
  const pausesong = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    console.log("pausing song");
    fetch("/spotify/pause", requestOptions)
      .then((response) => {
        // Log the response here
        if (response.ok) {
          // Pause request was successful
          // Perform any desired actions here
        } else {
          // Handle error or unexpected response
        }
      })
      .catch((error) => {
        // Handle fetch error
      });
  };

  const playsong = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    console.log("playing song");
    fetch("/spotify/play", requestOptions);
  };

  const skipsong = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    console.log("skipping song");
    fetch("/spotify/skip", requestOptions);
  };

  return (
    <Card>
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          <img
            src={song.image_url}
            height="100%"
            width="100%"
            alt="Song Cover"
          />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {song.title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {song.artist}
          </Typography>
          <div>
            <IconButton
              onClick={() => {
                song.is_playing ? pausesong() : playsong();
              }}
            >
              {song.is_playing ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton
              onClick={() => {
                skipsong();
              }}
            >
              {song.votes} / {song.votes_required}
              <SkipNext />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress
        variant="determinate"
        value={(song.time / song.duration) * 100}
      />
    </Card>
  );
}
