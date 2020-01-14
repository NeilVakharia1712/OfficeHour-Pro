import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography
} from "@material-ui/core";
import "firebase/database";
import firebase from "firebase/app";
import OngoingOfficeHours from "./OngoingOfficeHours";
import { areOHOngoing } from "./OngoingOfficeHours.js";

const useStyles = makeStyles({
  card: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

const toggleCheckInOut = (
  user,
  courseName,
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

    //Number Of Students
    const ref = firebase
      .database()
      .ref("courses/" + courseNumber + "/officeHours/CheckedInUsers");
    ref.once("value").then((snapshot) => {
      const count = snapshot.numChildren();
      console.log(count);
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

    //Count Number Of Students
    const ref = firebase
      .database()
      .ref("courses/" + courseNumber + "/officeHours/CheckedInUsers");
    ref.once("value").then((snapshot) => {
      const count = snapshot.numChildren();
      console.log(count);
    });

    setCheckInText("Check in");
  }
};

const CourseCard = ({ user, courseName, courseNumber, officeHours, isCheckedIn }) => {
  const classes = useStyles();
  const [checkInText, setCheckInText] = useState(isCheckedIn ? "Check out" : "Check in");

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
        />
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            toggleCheckInOut(user, courseName, courseNumber, checkInText, setCheckInText);
          }}
          color="secondary"
          size="small"
          disabled={!(areOHOngoing(courseNumber, officeHours).isOngoing)}
        >
          {checkInText}
        </Button>
      </CardActions>
    </Card>
  );
};

export default CourseCard;
