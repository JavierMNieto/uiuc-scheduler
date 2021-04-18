import React from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import withWidth from "@material-ui/core/withWidth";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import BubbleChartIcon from "@material-ui/icons/BubbleChart";
import ScheduleIcon from "@material-ui/icons/Schedule";
import DashboardIcon from "@material-ui/icons/Dashboard";

import { DRAWER_WIDTH } from "../lib/Constants";

const SearchDrawer = dynamic(() => import("./SearchDrawer"));
const WorkspaceDrawer = dynamic(() => import("./WorkspaceDrawer"));

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    overflow: "hidden",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  toolBar: {
    minHeight: 48,
  },
  appBarShiftLeft: {
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      marginLeft: DRAWER_WIDTH,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  appBarShiftRight: {
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      marginRight: DRAWER_WIDTH,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  title: {
    flexGrow: 1,
  },
  menuButtonLeft: {
    marginRight: theme.spacing(2),
  },
  menuButtonRight: {
    marginLeft: theme.spacing(2),
  },
  main: {
    flexGrow: 1,
    height: "100vh",
    overflow: "hidden",
    [theme.breakpoints.up("sm")]: {
      paddingTop: 72,
    },
    [theme.breakpoints.only("xs")]: {
      paddingTop: 50,
    },
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawer: {
    width: DRAWER_WIDTH,
    overflowX: "hidden",
    flexShrink: 0,
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
  },
  contentShiftLeft: {
    [theme.breakpoints.up("lg")]: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: DRAWER_WIDTH,
    },
  },
  contentShiftRight: {
    [theme.breakpoints.up("lg")]: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: DRAWER_WIDTH,
    },
  },
}));

const a11yProps = (index) => {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
};

const routes = ["/", "/schedule", "/charts"];

export default withWidth()(function App({
  width,
  children,
  hasSearch = false,
  hasWorkspace = false,
  tab = 0,
}) {
  const classes = useStyles();
  const router = useRouter();
  const temporaryDrawer = isMobile || /xs|sm|md/.test(width);
  const isExtraSmall = /xs/.test(width);
  const [searchOpen, setSearchOpen] = React.useState(
    !temporaryDrawer
  );
  const [workspaceOpen, setWorkspaceOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(tab);
  
  React.useEffect(() => {
    setTabValue(tab);
  }, [tab]);

  React.useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("resize"));
    }, 75);
  }, [searchOpen, workspaceOpen, tab]);

  const handleTabChange = (event, newValue) => {
    router.push(routes[newValue]);
  };

  const handleSearchDrawerOpen = () => {
    setWorkspaceOpen(false);
    setSearchOpen(true);
  };

  const handleSearchDrawerClose = () => {
    setSearchOpen(false);
  };

  const handleWorkspaceDrawerOpen = () => {
    setSearchOpen(false);
    setWorkspaceOpen(true);
  };

  const handleWorkspaceDrawerClose = () => {
    setWorkspaceOpen(false);
  };

  return (
    <>
      <header>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShiftLeft]: searchOpen && hasSearch,
            [classes.appBarShiftRight]: workspaceOpen && hasWorkspace,
          })}
        >
          <Toolbar className={classes.toolBar}>
            <Fade in={hasSearch}>
              {searchOpen ? (
                <IconButton
                  color="inherit"
                  aria-label="close search drawer"
                  onClick={handleSearchDrawerClose}
                  edge="start"
                  className={classes.menuButtonLeft}
                >
                  <ChevronLeftIcon />
                </IconButton>
              ) : (
                <IconButton
                  color="inherit"
                  aria-label="open search drawer"
                  onClick={handleSearchDrawerOpen}
                  edge="start"
                  className={classes.menuButtonLeft}
                >
                  <SearchIcon />
                </IconButton>
              )}
            </Fade>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              className={classes.title}
              variant="fullWidth"
              scrollButtons="off"
            >
              <Tab
                icon={<DashboardIcon />}
                label={!isExtraSmall && "Dashboard"}
                {...a11yProps(0)}
              />
              <Tab
                icon={<ScheduleIcon />}
                label={!isExtraSmall && "Schedule"}
                {...a11yProps(1)}
              />
              <Tab
                icon={<BubbleChartIcon />}
                label={!isExtraSmall && "Charts"}
                {...a11yProps(2)}
              />
            </Tabs>
            <Fade in={hasWorkspace}>
              {workspaceOpen ? (
                <IconButton
                  color="inherit"
                  aria-label="close workspace drawer"
                  onClick={handleWorkspaceDrawerClose}
                  edge="end"
                  className={classes.menuButtonRight}
                >
                  <ChevronRightIcon />
                </IconButton>
              ) : (
                <IconButton
                  color="inherit"
                  aria-label="open workspace drawer"
                  onClick={handleWorkspaceDrawerOpen}
                  edge="end"
                  className={classes.menuButtonRight}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Fade>
          </Toolbar>
        </AppBar>
      </header>
      <nav>
        <SearchDrawer
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
          variant={temporaryDrawer ? "temporary" : "persistent"}
          open={searchOpen && hasSearch}
          onOpen={handleSearchDrawerOpen}
          onClose={handleSearchDrawerClose}
        />
        <WorkspaceDrawer
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
          variant={temporaryDrawer ? "temporary" : "persistent"}
          anchor="right"
          open={workspaceOpen && hasWorkspace}
          onOpen={handleWorkspaceDrawerOpen}
          onClose={handleWorkspaceDrawerClose}
        />
      </nav>
      <main
        className={clsx(classes.main, {
          [classes.contentShiftLeft]: searchOpen,
          [classes.contentShiftRight]: workspaceOpen,
        })}
      >
        {children}
      </main>
    </>
  );
});
