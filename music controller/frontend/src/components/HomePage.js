// homepage component is similar to create room page component, but it has two buttons to join or create a room.

import React from "react";
import { Link, component } from "react-router-dom";
import { Button, Grid, ButtonGroup, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3" align="center">
            Welcome to Music Controller
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to="/info" component={Link}>
              Info
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </div>
  );
}
