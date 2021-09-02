import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Icon, Button, Box } from "@material-ui/core";
// local
import useCameraWebSocket from "../../hooks/useCameraWebSocket";
import RouterControls from "./RouterControls";
import MiniVideo from "./MiniVideo";
import {
  VIDEO_STREAM_CONFIG,
  COMMAND_STRINGS,
  NEW_CAMERA_COMMAND_EVENT
} from "../../config.js";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  rightAlign: {
    textAlign: "right"
  }
}));

export default function RouterControlContainer() {
  const classes = useStyles();

  const { sendMessage } = useCameraWebSocket(NEW_CAMERA_COMMAND_EVENT);

  const handleSendMessage = (commandName, commandValue) => {
    const payload = {
      action: {
        name: commandName,
        value: commandValue
      }
    };
    sendMessage(payload);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs>
          <MiniVideo
            videoSrc={VIDEO_STREAM_CONFIG.portObserverVideo}
            recording={false}
          />
        </Grid>
        <Grid item xs>
          <MiniVideo
            videoSrc={VIDEO_STREAM_CONFIG.portRecordVideo}
            recording={true}
          />
        </Grid>

        <Grid item xs>
          <MiniVideo
            videoSrc={VIDEO_STREAM_CONFIG.pilotVideo}
            recording={false}
          />
        </Grid>

        <Grid item xs>
          <MiniVideo
            videoSrc={VIDEO_STREAM_CONFIG.stbdObserverVideo}
            recording={false}
          />
        </Grid>
        <Grid item xs>
          <MiniVideo
            videoSrc={VIDEO_STREAM_CONFIG.stbdRecordVideo}
            recording={true}
          />
        </Grid>
      </Grid>

      <Box mt={1.5}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.ctrlButton}
              onClick={() =>
                handleSendMessage(COMMAND_STRINGS.recordSourceCommand, "PORT")
              }
            >
              Record Port Source
            </Button>
          </Grid>

          <Grid item xs className={classes.rightAlign}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.ctrlButton}
              onClick={() =>
                handleSendMessage(COMMAND_STRINGS.recordSourceCommand, "STBD")
              }
            >
              Record STBD Source
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box mt={3}>
        <RouterControls />
      </Box>
    </>
  );
}
