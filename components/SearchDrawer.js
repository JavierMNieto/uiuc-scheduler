import React from "react";
import dynamic from "next/dynamic";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Divider from "@material-ui/core/Divider";

const Filters = dynamic(() => import("./Filters"));
const SearchCourses = dynamic(() => import("./courses/SearchCourses"));

import { DEFAULT_FILTERS } from "../lib/Constants";

export default function SearchDrawer({ ...props }) {
  const [searchFilters, setSearchFilters] = React.useState(DEFAULT_FILTERS);

  return (
    <SwipeableDrawer {...props}>
      <Filters setSearchFilters={setSearchFilters} />
      <Divider />
      <SearchCourses filters={searchFilters} />
    </SwipeableDrawer>
  );
}
