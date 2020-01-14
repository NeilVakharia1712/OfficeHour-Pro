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
  if (checkInText == "Check in") {
    const db = firebase.database();
    //console.log(user.uid);
    //console.log(courseName);
    const CheckedInUser = firebase
      .database()
      .ref("courses/" + courseNumber + "/officeHours");
    CheckedInUser.on("value", function(snapshot) {
      //console.log(snapshot.val());
    });
    //console.log(CheckedInUser);

    firebase
      .database()
      .ref("courses/" + courseNumber + "/officeHours")
      .update({
        [user.uid]: user.uid
      });

    //Number Of Students
    const ref = firebase
      .database()
      .ref("courses/" + courseNumber + "/officeHours");
    ref.once("value").then(function(snapshot) {
      const count = snapshot.numChildren();
      console.log(count - 2); //subtract 2 becasue currently we have only 2 office hour slots
    });

    setCheckInText("Check out");
  } else if (checkInText == "Check out") {
    firebase
      .database()
      .ref("courses/" + courseNumber + "/officeHours")
      .child(user.uid)
      .remove();
    //Count Number Of Students
    const ref = firebase
      .database()
      .ref("courses/" + courseNumber + "/officeHours");
    ref.once("value").then(function(snapshot) {
      const count = snapshot.numChildren();
      console.log(count - 2);
    });

    setCheckInText("Check in");
  }
};

const CourseCard = ({ user, courseName, courseNumber, officeHours }) => {
  const classes = useStyles();
  const [checkInText, setCheckInText] = useState("Check in");

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
