import React from "react";
import { Container, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ObserverUIContainer from "./features/observer-ui/ObserverUIContainer";
import { SEALOG_URL } from "./config";
import useCameraWebSocket from "./hooks/useCameraWebSocket";
import { NEW_CAMERA_COMMAND_EVENT } from "./config";

const useStyles = makeStyles((theme) => ({
  sealogFrame: {
    width: "100%",
    height: "100%",
    position: "absolute",
    border: "none",
  },
  noSelect: {
    userSelect: "none",
  },
}));
export default function App() {
  const classes = useStyles();

  // send message to set active camera
  const { messages } = useCameraWebSocket(NEW_CAMERA_COMMAND_EVENT);
  console.log(messages);

  return (
    <Container maxWidth={false} disableGutters={true}>
      <Box className={classes.noSelect}>
        <ObserverUIContainer />
      </Box>
      <Box className={classes.noSelect}>
        <iframe
          src={SEALOG_URL}
          className={classes.sealogFrame}
          title="sealog"
        />
      </Box>
    </Container>
  );
}
