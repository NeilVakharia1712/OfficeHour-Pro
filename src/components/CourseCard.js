import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import 'firebase/database';
import firebase from 'firebase/app';
import OngoingOfficeHours from './OngoingOfficeHours';

const useStyles = makeStyles({
  card: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const CheckIn = (user, courseName, courseNumber) => {

  const db = firebase.database();
  console.log(user.uid);
  console.log(courseName); 
  const CheckedInUser = firebase.database().ref('courses/' + courseNumber + '/officeHours');
  CheckedInUser.on('value', function(snapshot){
    console.log(snapshot.val());
  });
  console.log(CheckedInUser); 

  firebase.database().ref('courses/' + courseNumber + '/officeHours').update({
    [user.uid]: user.uid
  })

  
}

const CourseCard = ({user, courseName, courseNumber, officeHours}) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {courseNumber}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {courseName}
        </Typography>
        <OngoingOfficeHours courseNumber={courseNumber} officeHours={officeHours} />
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
        <Button onClick={()=>{CheckIn(user, courseName, courseNumber)}} color="secondary" size="small">Check in</Button>
      </CardActions>
    </Card>
  );
}

export default CourseCard;
