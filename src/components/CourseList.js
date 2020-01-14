import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app';
import 'firebase/database';
import Grid from '@material-ui/core/Grid';
import CourseCard from './CourseCard';



const CourseList = props => {
    const db = firebase.database().ref();
    const [schedule, setSchedule] = useState(null);
    const [courses, setCourse] = useState([]);
    useEffect(() => {
        if (props.user) {
            const userDb = db.child('Users/' + props.user.uid);
            userDb.once('value').then(snapshot => {
                console.log("The database returns: " + snapshot)
                if (snapshot.val()) {
                    setCourse(snapshot.val().courses)
                }
            })
        }
        // eslint-disable-next-line
    }, [props.user])

    useEffect(() => {
        const getCourseInfo = snapshot => {
            if (snapshot.val()) setSchedule(snapshot.val());
        }
        const courseDb = db.child('courses')
        courseDb.once("value", getCourseInfo, error => alert(error));
    })

    if (props.user && schedule) {
        return (
            <Grid container spacing={1}>
                {courses.map(course => {
                    console.log(course)
                    return (
                        <Grid key={course} item xs={12}>
                            <CourseCard courseNumber={course} courseName={schedule[course]['title']} user={props.user} />
                        </Grid>)
                })
                }
            </Grid>
        )
    } else {
        if (props.user) {
            return (<p>{props.user.uid}</p>)
        } else {
            return (
                <p>Please Sign in</p>
            )
        }
    }
}

export default CourseList;