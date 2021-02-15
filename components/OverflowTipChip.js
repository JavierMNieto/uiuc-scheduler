import React, { useRef, useState, useEffect } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Chip from "@material-ui/core/Chip";

export default function OverflowTip(props) {
  const [isOverflowed, setIsOverflow] = useState(false);
  const chipRef = useRef();
  const spanRef = useRef();
  
  let iconOffset = 15;
  if (props.hasOwnProperty("icon") || props.hasOwnProperty("avatar")) iconOffset += 24;
  if (props.hasOwnProperty("onDelete") || props.hasOwnProperty("deleteIcon")) iconOffset += 24;

  useEffect(() => {
    setIsOverflow(
      spanRef.current.offsetWidth > chipRef.current.offsetWidth - iconOffset
    );
  }, [iconOffset]);

  return (
    <Tooltip
      placement="top"
      arrow
      title={<span style={{fontSize: 11}}>{props.label}</span>}
      disableHoverListener={!isOverflowed}
    >
      <Chip
        {...props}
        ref={chipRef}
        label={<span ref={spanRef}>{props.label}</span>}
      />
    </Tooltip>
  );
}
