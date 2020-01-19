import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app';
import 'firebase/database';
import { Grid, Button } from '@material-ui/core';
import CourseCard from './CourseCard';
import { SignInWithGoogle } from './Login'

const CourseList = ({ user, schedule }) => {
    const db = firebase.database().ref();
    const [courses, setCourse] = useState([]);
    const [checkedInCourse, setCheckedInCourse] = useState(null);

    useEffect(() => {
        if (user) {
            const userDb = db.child('Users/' + user.uid);
            userDb.once('value').then(snapshot => {
                if (snapshot.val()) {
                    setCourse(snapshot.val().courses)
                    setCheckedInCourse(snapshot.val().checkedInCourse);
                }
            })
        }
        // eslint-disable-next-line
    }, [user])

    if (user && schedule && checkedInCourse) {
        return (
            <Grid container spacing={1}>
                {courses.map(course => {
                    return (
                        <Grid key={course} item xs={12}>
                            <CourseCard
                                courseNumber={course}
                                courseName={schedule[course]['title']}
                                officeHours={schedule[course]['officeHours']}
                                user={user}
                                isCheckedIn={course === checkedInCourse} 
                                mode='CourseList'
                            />
                        </Grid>)
                })
                }
            </Grid>
        )
    } else if (user && schedule) {
        return (
            <div className="content">
                <p className="notification">Enroll courses to see office hours</p>
            </div>
        )
    } else {
        return (
            <div className="content">
                <p className="notification">Please Sign in to see the course list</p>
                <Button variant="contained" color="primary" onClick={() => { SignInWithGoogle() }}>Sign In</Button>
            </div>
        )
    }
}

export default CourseList;
