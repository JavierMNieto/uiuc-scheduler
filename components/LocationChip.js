import React from "react";
import ExploreIcon from "@material-ui/icons/Explore";

import OverflowTipChip from "./OverflowTipChip";
import { FILTER_COLORS } from "../lib/Theme";

export default function InstructorChip({ value, ...props }) {
  return (
    <OverflowTipChip
      {...props}
      label={value}
      style={{
        backgroundColor: FILTER_COLORS.Instructor,
        marginTop: 2,
        marginBottom: 2,
      }}
      deleteIcon={<ExploreIcon />}
      onDelete={console.log}
    />
  );
}
