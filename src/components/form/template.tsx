import React, { ComponentType, KeyboardEvent } from "react";

import { Props } from "./index";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";

export const FormComponent = ({
  formState,
  setUsername,
  setEmail,
  setPassword,
  location,
  handleSubmit
}: Props) => {
  const currentRoute = location.pathname.toLowerCase().slice(1);
  const formHeading =
    currentRoute === "login"
      ? "Login to enter Project-S"
      : "Sign Up to enter Project-S";

  return (
    <main className="container">
      <Grid container spacing={16} justify="center">
        <Grid item md={7} sm={9} xs={12}>
          <Paper className="paper">
            <Typography align="center" variant="display1" className="mbottom-2">
              {formHeading}
            </Typography>
            <Grid container justify="center">
              <Grid item md={6} sm={7} xs={10}>
                <FormControl margin="normal" fullWidth>
                  {currentRoute === "signup" && (
                    <FormControl margin="dense">
                      <InputLabel htmlFor="username">Username</InputLabel>
                      <Input
                        id="username"
                        placeholder="Username"
                        value={formState.username}
                        onChange={setUsername}
                      />
                    </FormControl>
                  )}
                  <FormControl margin="dense">
                    <InputLabel htmlFor="username">email</InputLabel>
                    <Input
                      id="email"
                      placeholder="email"
                      value={formState.email}
                      onChange={setEmail}
                    />
                  </FormControl>
                  <FormControl margin="dense">
                    <InputLabel htmlFor="password">password</InputLabel>
                    <Input
                      id="password"
                      placeholder="password"
                      value={formState.password}
                      onChange={setPassword}
                    />
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </main>
  );
};
