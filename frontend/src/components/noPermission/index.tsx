import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { Grid, Button } from "@mui/material";

const NoPermission = ({ ...props }) => {
  const navigate = useNavigate();
  const goBack = () => navigate("/login");

  return (
    <div className="error-message">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1" color="red" gutterBottom>
            101
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h3" color="red">
            No Permission
          </Typography>
          <Typography variant="h6">
            You don't have Permission for this page
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            startIcon={<LoginIcon />}
            variant="contained"
            color="error"
            onClick={goBack}
          >
            Login
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default NoPermission;
