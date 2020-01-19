import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Grid,
  Checkbox
} from "@material-ui/core";
import "firebase/database";
import firebase from "firebase/app";
import OngoingOfficeHours from "./OngoingOfficeHours";
import { areOHOngoing } from "./OngoingOfficeHours.js";
import '../App.css';

const useStyles = makeStyles({
  card: {
    minWidth: 325,
    maxWidth: 500
  },
  title: {
    fontSize: 14
  }
});

const toggleCheckInOut = (
  user,
  courseNumber,
  checkInText,
  setCheckInText
) => {
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
      .child('checkedInCourse')
      .remove();

    setCheckInText("Check in");
  }
};

const CourseCard = ({ user, courseName, courseNumber, officeHours, isCheckedIn, mode }) => {
  const classes = useStyles();
  const [checkInText, setCheckInText] = useState(isCheckedIn ? "Check out" : "Check in");
  const [count, setCount] = useState(0);

  useEffect(() => {
    //Number Of Students
    const ref = firebase
      .database()
      .ref("courses/" + courseNumber + "/officeHours/CheckedInUsers");
    ref.on("value", (snapshot) => {
      const count = snapshot.numChildren();
      setCount(count);
    });
  })

  if (mode == 'CourseList') {
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
          {/* <Button size="small">Learn More</Button> // TO DO make this button functional */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              toggleCheckInOut(user, courseNumber, checkInText, setCheckInText, setCount);
            }}
            size="small"
            disabled={!(areOHOngoing(courseNumber, officeHours).isOngoing)}
          >
            {checkInText}
          </Button>
        </CardActions>
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
              <Typography color="textSecondary">
                {courseName}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Checkbox />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
};

export default CourseCard;
