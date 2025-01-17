import React from "react";
import { List, ListItem } from "@material-ui/core";
// local
import SelectShutterMode from "../camera-controls/SelectShutterMode";
import SelectIrisMode from "../camera-controls/SelectIrisMode";
import SelectIsoMode from "../camera-controls/SelectIsoMode";

export default function TopCameraCommandsList() {
  return (
    <List>
      <ListItem disableGutters={true}>
        <SelectShutterMode />
      </ListItem>
      <ListItem disableGutters={true}>
        <SelectIrisMode />
      </ListItem>
      <ListItem disableGutters={true}>
        <SelectIsoMode />
      </ListItem>
    </List>
  );
}
