import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { ListItemIcon } from '@material-ui/core';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import "firebase/database";
import firebase from "firebase/app";

const crowdedness = [0, 1, 2, 3];
const description = ['Empty', 'Little Crowded', 'Moderate Crowded', 'Very Crowded'];
const level = [<SentimentSatisfiedAltIcon />, <SentimentSatisfiedIcon />, <SentimentDissatisfiedIcon />, <SentimentVeryDissatisfiedIcon />]

const FeedBackSelector = ({ feedbackOpen, setFeedbackOpen, user, courseNumber }) => {

    const handleListItemClick = crowd => {
        CheckIn(user, courseNumber, crowd)
        setFeedbackOpen(false)
    };

    const CheckIn = (user, courseNumber, level) => {
        firebase
            .database()
            .ref("courses/" + courseNumber + "/officeHours/CheckedInUsers")
            .update({
                [user.uid]: {
                    "time": Math.round(+new Date()/1000),
                    "level": level+1
                }
            });

        firebase
            .database()
            .ref("Users/" + user.uid + "/checkedInCourse")
            .update({
                [courseNumber]: true
            });
    }

    return (
        <Dialog aria-labelledby="simple-dialog-title" open={feedbackOpen}>
            <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
            <List>
                {crowdedness.map(crowd => (
                    <ListItem button onClick={() => {handleListItemClick(crowd)}} key={crowd}>
                        <ListItemIcon>
                            {level[crowd]}
                        </ListItemIcon>
                        <ListItemText primary={description[crowd]} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

export default FeedBackSelector
