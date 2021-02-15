import React from "react";
import InfoIcon from "@material-ui/icons/Info";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";

import OverflowTipChip from "./OverflowTipChip";
import { FILTER_COLORS } from "../lib/Theme";

export default function InstructorChip({ value, ...props }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <React.Fragment>
      <OverflowTipChip
        {...props}
        label={value}
        style={{ backgroundColor: FILTER_COLORS.Instructor, marginTop: 2, marginBottom: 2 }}
        deleteIcon={<InfoIcon />}
        onDelete={(event) => setAnchorEl(event.target)}
      />
      <Popover
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Typography>{value}</Typography>
      </Popover>
    </React.Fragment>
  );
}
