import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  Checkbox,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "firebase/database";
import firebase from "firebase/app";
import OngoingOfficeHours from "./OngoingOfficeHours";
import {
  formatFullDayOfWeekString,
  formatTime
} from "./OngoingOfficeHours.js";
import "../App.css";
import OHForm from "./OHForm";

const useStyles = makeStyles({
  card: {
    minWidth: 325
  },
  title: {
    fontSize: 14
  },
  expandSummary: {
    fontSize: 14,
    color: "grey"
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

const unchecked = (
  user,
  courseNumber,
  setEnroll,
  isCheckedIn
) => {
  const ref = firebase.database().ref("Users/" + user.uid);
  if (!isCheckedIn) {
    console.log("remove checked in courses");
    toggleCheckInOut(user, courseNumber, true);
  }
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

const deleteOHSession = (courseNumber, sessionId, setCourse) => {
  firebase
    .database()
    .ref("courses/" + courseNumber + "/officeHours")
    .child(sessionId)
    .remove()
    .then(() => {
      console.log("refresh");
    });
};

const toggleCheckInOut = (user, courseNumber, isCheckedIn) => {
  if (!isCheckedIn) {
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

  } else {
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

    isCheckedIn = false;
  }
};

const CourseCard = ({
  user,
  courseName,
  courseNumber,
  officeHours,
  isCheckedIn,
  mode,
  isEnrolled = false,
  setCourse,
  isProf
}) => {
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const [enroll, setEnroll] = useState(isEnrolled);

  useEffect(() => {
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
      <Card className={classes.card} style={{ marginTop: "10px" }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {courseNumber}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {courseName}
          </Typography>
          {isProf ? null :
            <OngoingOfficeHours
              className="ongoing"
              courseNumber={courseNumber}
              officeHours={officeHours}
              count={count}
            >
              {isCheckedIn ? 
              <Typography variant="subtitle2" align="center" color="secondary" style={{ marginBottom: "7px" }}>
                Successfully checked in!
              </Typography> : null}
              <Button
                variant={isCheckedIn ? "outlined" : "contained"}
                color="primary"
                onClick={() => {
                  toggleCheckInOut(
                    user,
                    courseNumber,
                    isCheckedIn
                  );
                }}
                disabled={isCheckedIn}
                style={{ width: "100%" }}
              >
                check in
            </Button>
            </OngoingOfficeHours>
          }
        </CardContent>
        {
          officeHours !== undefined ? (
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
              >
                <Typography className={classes.expandSummary}>
                  All Office Hours:
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container spacing={2}>
                  {
                    Object.keys(officeHours).map(sessionId =>
                      sessionId !== "CheckedInUsers" ? (
                        <Grid item container key={sessionId}>
                          <Grid item xs={4}>
                            <Typography variant="h6">
                              {formatFullDayOfWeekString(
                                officeHours[sessionId].weekDay
                              )}
                            </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="h6" align="right">
                              {formatTime(officeHours[sessionId].startTime)} - {formatTime(officeHours[sessionId].endTime)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            {`${officeHours[sessionId].instructorName} (${officeHours[sessionId].TAProf})`}
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1" align="right">
                              {officeHours[sessionId].location}
                            </Typography>
                          </Grid>
                          {
                            isProf ? (
                              <Grid item xs={12}>
                                <Typography variant="body1" align="right">
                                  <Button variant="text" color="secondary" onClick={() => { deleteOHSession(courseNumber, sessionId, setCourse); }}>
                                    Delete
                                  </Button>
                                  <OHForm
                                    courseNumber={courseNumber}
                                    sessionId={sessionId}
                                    officeHours={officeHours[sessionId]}
                                  />
                                </Typography>
                              </Grid>
                            ) : null
                          }
                        </Grid>
                      ) : null
                    )
                  }
                  {
                    isProf ? (
                      <Grid container justify="center">
                        <OHForm courseNumber={courseNumber} />
                      </Grid>
                    ) : null
                  }
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ) : isProf ? (
            <Grid container justify="center" style={{ marginBottom: "20px" }}>
              <OHForm courseNumber={courseNumber} />
            </Grid>
          ) : null
        }
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
                    ? unchecked(
                      user,
                      courseNumber,
                      setEnroll,
                      isCheckedIn
                    )
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
