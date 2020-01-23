import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Grid,
  Checkbox,
  Collapse,
  TableContainer,
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableHead
} from "@material-ui/core";
import { ExpandMore, ExpandLess } from "@material-ui/icons";
import "firebase/database";
import firebase from "firebase/app";
import OngoingOfficeHours from "./OngoingOfficeHours";
import {
  areOHOngoing,
  formatFullDayOfWeekString,
  formatTime
} from "./OngoingOfficeHours.js";
import "../App.css";

const useStyles = makeStyles({
  card: {
    minWidth: 325,
    maxWidth: 500
  },
  title: {
    fontSize: 14
  }
});

const checked = (user, courseNumber, setEnroll) => {
  const ref = firebase.database().ref("Users/" + user.uid);
  ref.once("value", snapshot => {
    let courseList = [];
    if (!snapshot.val()) {
      courseList.push(courseNumber);
    } else {
      courseList = snapshot.val()["courses"];
      courseList.push(courseNumber);
    }
    ref.update({
      ["courses"]: courseList
    });
  });
  setEnroll(true);
};

const unchecked = (user, courseNumber, setEnroll) => {
  const ref = firebase.database().ref("Users/" + user.uid);
  ref.once("value", snapshot => {
    let courseList = snapshot.val()["courses"];
    let pos = courseList.indexOf(courseNumber);
    courseList.splice(pos, 1);
    if (courseList) {
      ref.update({
        ["courses"]: courseList
      });
    } else {
      ref.remove();
    }
  });
  setEnroll(false);
};

const toggleCheckInOut = (user, courseNumber, checkInText, setCheckInText) => {
  if (checkInText === "Check in") {
    firebase
      .database()
      .ref("courses/" + courseNumber + "/officeHours/CheckedInUsers")
      .update({
        [user.uid]: user.uid
      });

    firebase
      .database()
      .ref("Users/" + user.uid)
      .update({
        checkedInCourse: courseNumber
      });

    setCheckInText("Check out");
  } else if (checkInText === "Check out") {
    firebase
      .database()
      .ref("courses/" + courseNumber + "/officeHours/CheckedInUsers")
      .child(user.uid)
      .remove();

    firebase
      .database()
      .ref("Users/" + user.uid)
      .child("checkedInCourse")
      .remove();

    setCheckInText("Check in");
  }
};

const CourseCard = ({
  user,
  courseName,
  courseNumber,
  officeHours,
  isCheckedIn,
  mode,
  isEnrolled = false
}) => {
  const classes = useStyles();
  const [checkInText, setCheckInText] = useState(
    isCheckedIn ? "Check out" : "Check in"
  );
  const [count, setCount] = useState(0);
  const [enroll, setEnroll] = useState(isEnrolled);
  const [openLearnMore, setOpenLearnMore] = useState(false);

  useEffect(() => {
    //Number Of Students
    const ref = firebase
      .database()
      .ref("courses/" + courseNumber + "/officeHours/CheckedInUsers");
    ref.on("value", snapshot => {
      const count = snapshot.numChildren();
      setCount(count);
    });
  });

  if (mode === "CourseList") {
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {courseNumber}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {courseName}
          </Typography>
          <OngoingOfficeHours
            courseNumber={courseNumber}
            officeHours={officeHours}
            count={count}
          />
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => setOpenLearnMore(!openLearnMore)}>
            Learn More {openLearnMore ? <ExpandLess /> : <ExpandMore />}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              toggleCheckInOut(user, courseNumber, checkInText, setCheckInText);
            }}
            size="small"
            disabled={!areOHOngoing(courseNumber, officeHours).isOngoing}
          >
            {checkInText}
          </Button>
        </CardActions>
        <Collapse in={openLearnMore} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>All Office Hours:</Typography>
            <TableContainer>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell size="small">Day</TableCell>
                    <TableCell align="right">Time</TableCell>
                    <TableCell align="right">TA/Professor</TableCell>
                    <TableCell align="right">Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(officeHours).map(session_id =>
                    session_id !== "CheckedInUsers" ? (
                      <TableRow key={session_id}>
                        <TableCell component="th" scope="row" size="small">
                          {formatFullDayOfWeekString(
                            officeHours[session_id].weekDay
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {formatTime(officeHours[session_id].startTime)} -{" "}
                          {formatTime(officeHours[session_id].endTime)}
                        </TableCell>
                        <TableCell align="right">
                          {officeHours[session_id].TAProf}
                        </TableCell>{" "}
                        <TableCell align="right">
                          {officeHours[session_id].location}
                        </TableCell>
                      </TableRow>
                    ) : null
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Collapse>
      </Card>
    );
  } else {
    return (
      <Card className={classes.card}>
        <CardContent>
          <Grid container>
            <Grid item xs={11}>
              <Typography variant="h5" component="h2">
                {courseNumber}
              </Typography>
              <Typography color="textSecondary">{courseName}</Typography>
            </Grid>
            <Grid item xs={1}>
              <Checkbox
                checked={enroll}
                onChange={() => {
                  enroll
                    ? unchecked(user, courseNumber, setEnroll)
                    : checked(user, courseNumber, setEnroll);
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
};

export default CourseCard;
