import React from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ListSubheader from "@material-ui/core/ListSubheader";
import { useTheme } from "@material-ui/core/styles";
import { VariableSizeList as List } from "react-window";
import { matchSorter } from "match-sorter";

import { Instructor as InstructorAutocomplete } from "./Autocompletes";
import { Instructors } from "../../lib/Data";
import InstructorChip from "../InstructorChip";

const LISTBOX_PADDING = 8;

function renderRow(props) {
  const { data, index, style } = props;
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: style.top + LISTBOX_PADDING,
    },
  });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child) => {
    if (React.isValidElement(child) && child.type === ListSubheader) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <List
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </List>
      </OuterElementContext.Provider>
    </div>
  );
});

export default function Instructor({ instructors, onChange }) {
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  
  const handleOpen = () => {
    if (inputValue.length > 1) {
      setOpen(true);
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    if (newInputValue.length > 1) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  return (
    <InstructorAutocomplete
      multiple
      filterSelectedOptions
      disableListWrap
      forcePopupIcon={false}
      ListboxComponent={ListboxComponent}
      open={open}
      onOpen={handleOpen}
      onClose={() => setOpen(false)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      filterOptions={(options, { inputValue }) =>
        matchSorter(Instructors, inputValue)
      }
      onChange={(e, value) => onChange({ instructor: value })}
      options={Instructors}
      value={instructors}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Instructor(s)"
          placeholder="Instructor (Last Name, First Initial)"
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((name, index) => (
          <InstructorChip key={name + index} value={name} {...getTagProps(index)} />
        ))
      }
      renderOption={(option) => <Typography noWrap>{option}</Typography>}
    />
  );
}
