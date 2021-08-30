import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactNipple from "react-nipple";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import { Box, Grid, Button, Typography, Divider } from "@material-ui/core";
import CenterFocusStrongIcon from "@material-ui/icons/CenterFocusStrong";
import useCameraWebSocket from "../../hooks/useCameraWebSocket";
import useLongPress from "../../hooks/useLongPress";
import {
  selectCurrentCamData,
  changeCameraSettings
} from "./cameraControlsSlice";
import FocusModeButton from "./FocusModeButton";
import { COMMAND_STRINGS } from "../../config.js";
import { NEW_CAMERA_COMMAND_EVENT } from "../../config.js";

const useStyles = makeStyles(theme => ({
  root: {
    //flexGrow: 1
  },
  camButton: {
    width: "100%",
    fontSize: ".8em"
  },
  ctrlButton: {
    width: "100%",
    fontSize: ".7em"
  }
  /*
  joystickContainer: {
    position: "relative",
    width: "100%",
    height: "200px"
  }
  */
}));

export default function CameraControlButtons() {
  const classes = useStyles();
  const joystickElem = useRef(null);
  const timerRef = useRef(false);
  const camData = useSelector(selectCurrentCamData);

  const { messages, sendMessage } = useCameraWebSocket(
    NEW_CAMERA_COMMAND_EVENT
  );
  const [showJoystick, setShowJoystick] = useState(false);

  useEffect(() => {
    // delay loading of the virtual joystick until CSS transtion ends (.4s)
    setTimeout(() => {
      setShowJoystick(true);
    }, 500);
  }, []);

  const handleZoomHold = commandValue => {
    console.log(commandValue);
    handleSendMessage(COMMAND_STRINGS.focusControlCommand, commandValue);
    // Set a Timeout to resend command every 1 sec
    timerRef.current = setTimeout(handleZoomHold, 1000, commandValue);
  };

  const handleZoomStop = () => {
    console.log();
    if (timerRef.current) {
      clearTimeout(timerRef.current);

      handleSendMessage(
        COMMAND_STRINGS.focusControlCommand,
        COMMAND_STRINGS.focusStop
      );
    }
  };

  const focusNearBtnProps = useLongPress({
    onClick: () =>
      handleSendMessage(
        COMMAND_STRINGS.focusControlCommand,
        COMMAND_STRINGS.focusNearOneStop
      ),
    onLongPress: () => handleZoomHold(COMMAND_STRINGS.focusNearContinuos),
    onStop: () => handleZoomStop()
  });

  const focusFarBtnProps = useLongPress({
    onClick: () =>
      handleSendMessage(
        COMMAND_STRINGS.focusControlCommand,
        COMMAND_STRINGS.focusFarOneStop
      ),
    onLongPress: () => handleZoomHold(COMMAND_STRINGS.focusFarContinuos),
    onStop: () => handleZoomStop()
  });

  const zoomNearBtnProps = useLongPress({
    onClick: () =>
      handleSendMessage(
        COMMAND_STRINGS.zoomControlCommand,
        COMMAND_STRINGS.zoomNearOneStop
      ),
    onLongPress: () => handleZoomHold(COMMAND_STRINGS.zoomNearContinuos),
    onStop: () => handleZoomStop()
  });

  const zoomFarBtnProps = useLongPress({
    onClick: () =>
      handleSendMessage(
        COMMAND_STRINGS.zoomControlCommand,
        COMMAND_STRINGS.zoomFarOneStop
      ),
    onLongPress: () => handleZoomHold(COMMAND_STRINGS.zoomFarContinuos),
    onStop: () => handleZoomStop()
  });

  const handleSendMessage = (commandName, commandValue) => {
    if (commandValue === undefined) {
      let commandValue;
    }

    if (commandName === COMMAND_STRINGS.focusModeCommand) {
      if (camData.currentSettings.focus_mode === COMMAND_STRINGS.focusAF) {
        commandValue = COMMAND_STRINGS.focusMF;
      } else {
        commandValue = COMMAND_STRINGS.focusAF;
      }
    }

    const payload = {
      action: {
        name: commandName,
        value: commandValue
      }
    };
    sendMessage(payload);
  };

  const renderCmdReceipt = () => {
    if (messages.length) {
      const lastMessage = messages[messages.length - 1];
      return (
        <span>
          {lastMessage.receipt.status}
          <br />
          {lastMessage.eventId}
        </span>
      );
    }
  };

  return (
    <div className={classes.root}>
      <Box my={1}>
        <FocusModeButton />
      </Box>

      <Box my={3}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              {...focusNearBtnProps}
            >
              Near
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              {...zoomNearBtnProps}
            >
              Tele
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="overline" gutterBottom>
              Focus
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="overline" gutterBottom>
              Zoom
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              {...focusFarBtnProps}
            >
              Far
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              {...zoomFarBtnProps}
            >
              Wide
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      {showJoystick && (
        <Box mt={3}>
          <ReactNipple
            options={{
              mode: "static",
              size: 150,
              position: { top: "50%", left: "50%" },
              color: "blue",
              dynamicPage: true
            }}
            style={{
              position: "relative",
              width: "100%",
              height: 150
              // if you pass position: 'relative', you don't need to import the stylesheet
            }}
            onMove={(evt, data) => {
              console.log(evt, data);
              const payload = {
                position: data.position,
                distance: data.distance,
                angle: data.angle,
                direction: data.direction
              };
              handleSendMessage(COMMAND_STRINGS.panTiltCommand, payload);
            }}
          />
          <Typography variant="h6">P & T</Typography>
        </Box>
      )}
    </div>
  );
}
