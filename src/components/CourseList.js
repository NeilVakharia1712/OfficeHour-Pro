import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app';
import 'firebase/database';
import { Grid, Button } from '@material-ui/core';
import CourseCard from './CourseCard';
import { SignInWithGoogle } from './Login'

const CourseList = ({ user }) => {
    const db = firebase.database().ref();
    const [schedule, setSchedule] = useState(null);
    const [courses, setCourse] = useState([]);
    useEffect(() => {
        if (user) {
            const userDb = db.child('Users/' + user.uid);
            userDb.once('value').then(snapshot => {
                setCourse(snapshot.val().courses)
            })
        }
    }, [user])

    useEffect(() => {
        const getCourseInfo = snapshot => {
            if (snapshot.val()) setSchedule(snapshot.val());
        }
        const courseDb = db.child('courses')
        courseDb.once("value", getCourseInfo, error => alert(error));
    }, [])

    if (user && schedule) {
        return (
            <Grid container spacing={1}>
                {courses.map(course => {
                    console.log(course)
                    return(
                    <Grid key={course} item xs={12}>
                        <CourseCard courseNumber={course} courseName={schedule[course]['title']} officeHours={schedule[course]['officeHours']} user={user}/>
                    </Grid>)
                })
                }
            </Grid>
        )
    } else {
        return (
            <div class='content'>
                <p class='notification'>Please Sign in to see the course list</p>
                <Button variant="contained" color="primary" onClick={() => {SignInWithGoogle()}}>Sign In</Button>
            </div>
        )
    }
}

export default CourseList;
