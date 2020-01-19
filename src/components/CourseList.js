import React from 'react'
import { Grid, Button } from '@material-ui/core';
import CourseCard from './CourseCard';
import { SignInWithGoogle } from './Login'

const CourseList = ({ user, schedule, courses, checkedInCourse}) => {
    if (user && schedule && courses) {
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
