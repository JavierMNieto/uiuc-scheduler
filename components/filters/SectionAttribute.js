import React from "react";
import TextField from "@material-ui/core/TextField";

import OverflowTipChip from "../OverflowTipChip";
import { SectionAttribute as SectionAttributeAutocomplete } from "./Autocompletes";
import { SectionAttributes as DefaultSectionAttributes } from "../../lib/Data";

export default function SectionAttribute({
  attributes,
  onChange,
  SectionAttributes = DefaultSectionAttributes,
}) {
  return (
    <SectionAttributeAutocomplete
      multiple
      filterSelectedOptions
      options={Object.keys(SectionAttributes)}
      limitTags={1}
      getOptionLabel={(attribute) => SectionAttributes[attribute]}
      value={attributes}
      onChange={(e, value) => onChange({ attribute: value })}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Section Attribute(s)"
          placeholder="Section Attribute"
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((attribute, index) => (
          <OverflowTipChip
            {...getTagProps({ index })}
            key={attribute}
            label={SectionAttributes[attribute]}
          />
        ))
      }
    />
  );
}
