import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import Chip from "@material-ui/core/Chip";
import AddIcon from "@material-ui/icons/AddCircle";

import { DRAWER_WIDTH } from "../../lib/Constants";
import { FILTER_COLORS } from "../../lib/Theme";
import { GenEds } from "../../lib/Data";

import OverflowTipChip from "../OverflowTipChip";
import CourseInfoModal from "./CourseInfoModal";
//import CourseAddModal from "./CourseAddModal";

import {
  useSemesters,
  useDispatchSemesters,
  isFutureSemester,
} from "../Semesters";

const useStyles = makeStyles(() => ({
  root: {
    margin: 8,
    whiteSpace: "normal !important",
  },
  header: {
    fontSize: 14,
  },
  footer: {
    marginTop: 2,
    fontSize: 14,
  },
  title: {
    fontSize: 18,
  },
  progress: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  YearTerm: {
    backgroundColor: FILTER_COLORS["YearTerm"],
  },
  CollegeSubject: {
    backgroundColor: FILTER_COLORS["CollegeSubject"],
  },
  GenEd: {
    backgroundColor: FILTER_COLORS["GenEd"],
  },
  SectionAttribute: {
    backgroundColor: FILTER_COLORS["SectionAttribute"],
  },
  Instructor: {
    backgroundColor: FILTER_COLORS["Instructor"],
  },
}));

export default function Course({ onDelete, ...courseProps }) {
  const classes = useStyles();
  const [elevation, setElevation] = React.useState(5);
  const [infoModalOpen, setInfoModalOpen] = React.useState(false);
  const { selectedSemester } = useSemesters();
  const dispatch = useDispatchSemesters();
  const {
    subject,
    number,
    name,
    semesters = [[]],
    genEds = [],
    attributes = [],
    description = "",
    creditHours = "",
    gpa,
    filters = {},
    id = `${subject} ${number}`,
    lastOffered = `${semesters[0][0]} ${semesters[0][1]}`,
  } = courseProps;

  const mouseEnter = () => {
    setElevation(24);
  };

  const mouseLeave = () => {
    setElevation(5);
  };

  const handleInfoModalOpen = () => {
    setInfoModalOpen(true);
  };

  const handleInfoModalClose = () => {
    setInfoModalOpen(false);
  };

  const getDeleteFunction = React.useCallback(() => {
    if (isFutureSemester(selectedSemester)) {
      return console.log;
    }
  }, [selectedSemester]);

  return (
    <Card
      className={classes.root}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      elevation={elevation}
    >
      <CardContent style={{ paddingBottom: 0 }}>
        <Grid container justify="space-between">
          <Typography
            className={classes.header}
            component="span"
            color="textSecondary"
            align="left"
            gutterBottom
          >
            <Chip
              label={id}
              deleteIcon={<AddIcon />}
              onDelete={getDeleteFunction()}
              color="primary"
            />
          </Typography>
          <Tooltip
            title="Last Offered"
            aria-label="last offered"
            placement="top"
            arrow
          >
            <Typography
              className={classes.header}
              color="textSecondary"
              align="right"
              component="span"
              gutterBottom
            >
              <Chip
                label={lastOffered}
                className={classes.YearTerm}
                onDelete={onDelete}
              />
            </Typography>
          </Tooltip>
        </Grid>
        <Typography
          className={classes.title}
          color="textPrimary"
          align="center"
          gutterBottom
        >
          {name}
        </Typography>
        <Grid container spacing={1} justify="center" align="center">
          {genEds
            .filter((genEd) => Boolean(GenEds[genEd]))
            .map((genEd, index) => (
              <Grid item key={genEd}>
                <OverflowTipChip
                  label={GenEds[genEd]}
                  className={classes.GenEd}
                  style={{
                    maxWidth:
                      index + 1 < genEds.length || genEds.length % 2 === 0
                        ? 0.35 * DRAWER_WIDTH
                        : 0.8 * DRAWER_WIDTH,
                  }}
                  size="small"
                />
              </Grid>
            ))}
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container justify="space-between" style={{ marginInline: 8 }}>
          <Button size="small" onClick={handleInfoModalOpen}>
            View More
          </Button>
          <Tooltip title="GPA" aria-label="gpa" placement="right" arrow>
            <Typography
              className={classes.footer}
              color="textSecondary"
              align="right"
            >
              {gpa ? gpa.toFixed(2) : "N/A"}
            </Typography>
          </Tooltip>
        </Grid>
        <CourseInfoModal
          open={infoModalOpen}
          handleClose={handleInfoModalClose}
          {...courseProps}
        />
      </CardActions>
    </Card>
  );
}
