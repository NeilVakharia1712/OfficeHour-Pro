import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import 'firebase/database';
import firebase from 'firebase/app';

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

const CheckIn = (props) => {

  const db = firebase.database();
  console.log(props.user.uid);
  console.log(props.courseName); 
  const CheckedInUser = firebase.database().ref('courses/' + props.courseNumber + '/officeHours');
  CheckedInUser.on('value', function(snapshot){
    console.log(snapshot.val());
  });
  console.log(CheckedInUser); 

  firebase.database().ref('courses/' + props.courseNumber + '/officeHours').update({
    [props.user.uid]: props.user.uid
  })

  
}

const CourseCard = props => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {props.courseNumber}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {props.courseName}
        </Typography>
        <Typography variant="body2" component="p">
          Incomming office hour: Jan 28 7:00 P.M.
        </Typography>

      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
        <Button onClick={()=>{CheckIn(props)}} color="secondary" size="small">Check in</Button>
      </CardActions>
    </Card>
  );
}

export default CourseCard;
