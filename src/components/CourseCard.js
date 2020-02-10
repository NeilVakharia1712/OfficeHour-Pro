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
  ExpansionPanelSummary,
  Snackbar
} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "firebase/database";
import firebase from "firebase/app";
import OngoingOfficeHours from "./OngoingOfficeHours";
import {
  formatFullDayOfWeekString,
} from "./OngoingOfficeHours.js";
import FeedBackSelector from './FeedbackSelector'
import "../App.css";
import OHForm from "./OHForm";
import '../App.css';

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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
      "courses": courseList
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
  const [feedbackSeletorOpen, setFeedbackSelectorOpen] = useState(false)
  const [messageOpen, setMessageOpen] = useState(false)

  useEffect(() => {
    const nums = []
    const dbRef = firebase.database().ref("courses/" + courseNumber + "/officeHours/CheckedInUsers");
    dbRef.orderByChild("time").limitToLast(3).on("child_added", snapshot => {
      nums.push(snapshot.val().level)
    });
    console.log(nums)
    if (nums.length === 0) {
      const count = 0;
      setCount(count)
    }
    else if (nums.length === 1) {
      const count = nums[0] * 1
      setCount(count)
    }
    else if (nums.length === 2) {
      const count = nums[1] * 0.7 + nums[0] * 0.3
      setCount(count)
    }

    else if (nums.length === 3) {
      const count = nums[2] * 0.6 + nums[1] * 0.3 + nums[0] * 0.1
      setCount(count)
    }
    console.log(count)
  });

  if (mode === "CourseList") {
    return (
      <Card className={classes.card} style={{ marginTop: "10px" }}>
        <CardContent>
          <FeedBackSelector feedbackOpen={feedbackSeletorOpen} setFeedbackOpen={setFeedbackSelectorOpen} user={user} courseNumber={courseNumber} setMessageOpen={setMessageOpen}/>
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
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setFeedbackSelectorOpen(true)
                }}
                disabled={isCheckedIn}
                style={{ width: "100%" }}
              >
                {isCheckedIn?'Already checked in':'check in'}
              </Button>
              <Snackbar open={messageOpen} autoHideDuration={6000} onClose={()=>{setMessageOpen(false)}}>
                <Alert onClose={()=>{setMessageOpen(false)}} severity="success">
                  Successfully checked in!
                </Alert>
              </Snackbar>
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
                              {officeHours[sessionId].startTime} - {officeHours[sessionId].endTime}
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
                          <Grid item xs={8}>
                            {`${officeHours[sessionId].email}`}
                          </Grid>
                          {
                            isProf ? (
                              <Grid item xs={12}>
                                <Typography variant="body1" align="right">
                                  <OHForm
                                    courseNumber={courseNumber}
                                    sessionId={sessionId}
                                    officeHours={officeHours[sessionId]}
                                  />
                                  <Button variant="text" color="secondary" onClick={() => { deleteOHSession(courseNumber, sessionId, setCourse); }}>
                                    Delete
                                  </Button>
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
