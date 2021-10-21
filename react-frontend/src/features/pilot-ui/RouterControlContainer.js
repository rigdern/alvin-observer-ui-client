import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button, Box } from "@material-ui/core";
import Red from "@material-ui/core/colors/red";
// local
import useCameraWebSocket from "../../hooks/useCameraWebSocket";
import RouterControls from "./RouterControls";
import MiniVideo from "./MiniVideo";
import {
  VIDEO_STREAM_CONFIG,
  COMMAND_STRINGS,
  NEW_CAMERA_COMMAND_EVENT,
  WS_SERVER_NAMESPACE_PORT,
  WS_SERVER_NAMESPACE_STARBOARD,
  WS_SERVER_NAMESPACE_PILOT,
} from "../../config.js";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  rightAlign: {
    textAlign: "right",
  },
  recStopButton: {
    backgroundColor: Red[600],
  },
}));

export default function RouterControlContainer() {
  const classes = useStyles();
  console.log(WS_SERVER_NAMESPACE_PILOT);
  const { sendMessage } = useCameraWebSocket(NEW_CAMERA_COMMAND_EVENT);

  const handleSendMessage = (commandName, commandValue) => {
    const payload = {
      action: {
        name: commandName,
        value: commandValue,
      },
    };
    sendMessage(payload);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs>
          <MiniVideo
            videoSrc={VIDEO_STREAM_CONFIG.portRecordVideo}
            observerSide={WS_SERVER_NAMESPACE_PORT}
            videoType="REC"
            key="video1"
          />
        </Grid>
        <Grid item xs>
          <MiniVideo
            videoSrc={VIDEO_STREAM_CONFIG.portObserverVideo}
            observerSide={WS_SERVER_NAMESPACE_PORT}
            videoType="OBS"
            key="video0"
          />
        </Grid>

        <Grid item xs>
          <MiniVideo
            videoSrc={VIDEO_STREAM_CONFIG.pilotVideo}
            observerSide={WS_SERVER_NAMESPACE_PILOT}
            videoType="PILOT"
            key="video2"
          />
        </Grid>

        <Grid item xs>
          <MiniVideo
            videoSrc={VIDEO_STREAM_CONFIG.stbdObserverVideo}
            observerSide={WS_SERVER_NAMESPACE_STARBOARD}
            videoType="OBS"
            key="video3"
          />
        </Grid>
        <Grid item xs>
          <MiniVideo
            videoSrc={VIDEO_STREAM_CONFIG.stbdRecordVideo}
            observerSide={WS_SERVER_NAMESPACE_STARBOARD}
            videoType="REC"
            key="video4"
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

          <Grid>
            <Button
              variant="contained"
              color="primary"
              className={classes.recStopButton}
              onClick={() =>
                handleSendMessage(COMMAND_STRINGS.recordSourceCommand, "ST")
              }
            >
              Stop All Recordings
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
