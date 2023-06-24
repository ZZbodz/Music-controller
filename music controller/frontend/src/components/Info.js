import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";

const pages = {
  JOIN: "pages.join",
  CREATE: "pages.create",
};

export default function Info({}) {
  const [page, setPage] = useState(pages.JOIN);

  useEffect(() => {
    console.log("ran");
    return () => console.log("cleanup");
  }, [page]);

  function joinInfo() {
    return "Join page";
  }

  function createInfo() {
    return "Create page";
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          what is this"
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="body1" component="p">
          {page === pages.JOIN ? joinInfo() : createInfo()}
        </Typography>
        <Grid item xs={12} align="center">
          <IconButton
            onClick={() => {
              page === pages.CREATE
                ? setPage(pages.JOIN)
                : setPage(pages.CREATE);
            }}
          >
            {page === pages.CREATE ? <NavigateBefore /> : <NavigateNext />}
          </IconButton>
        </Grid>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="primary" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
