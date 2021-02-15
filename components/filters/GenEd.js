import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grow from "@material-ui/core/Grow";
import OverflowTipChip from "../OverflowTipChip";

import { GenEd as GenEdAutocomplete } from "./Autocompletes";
import { GenEds, GenEdCategories } from "../../lib/Data";

export default function GenEd({ genEds, genEdsBy, onChange }) {
  return (
    <GenEdAutocomplete
      multiple
      filterSelectedOptions
      limitTags={1}
      options={Object.keys(GenEds)}
      groupBy={(genEd) => GenEdCategories[genEd]}
      getOptionLabel={(genEd) => GenEds[genEd]}
      value={genEds}
      onChange={(e, value) => onChange({ genEd: value })}
      renderTags={(value, getTagProps) =>
        value.map((genEd, index) => (
          <OverflowTipChip
            {...getTagProps({ index })}
            key={genEd}
            label={GenEds[genEd]}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label="Gen Ed(s)"
          placeholder="Gen Ed"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                <Grow in={genEds.length > 1} timeout={250}>
                  <InputAdornment
                    component={Select}
                    value={genEdsBy}
                    name="genEdsBy"
                    disableUnderline
                    onChange={onChange}
                    style={{
                      position: "absolute",
                      top: -5,
                      right: 100,
                    }}
                  >
                    <MenuItem value={"any"}>Any of</MenuItem>
                    <MenuItem value={"all"}>All of</MenuItem>
                  </InputAdornment>
                </Grow>
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
