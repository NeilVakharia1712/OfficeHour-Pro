import React from 'react'
import { Grid, Button } from '@material-ui/core';
import CourseCard from './CourseCard';
import { SignInWithGoogle } from './Login'
import '../App.css';

const CourseList = ({ user, schedule, courses, checkedInCourse, mode, setMode }) => {
	const AddCourses = () => {
		setMode(true);
	};

	if (user && schedule && courses && (courses.length !== 0)) {
		console.log('here');
		return (
			<Grid style={{marginTop: '5px'}} className="course-container" container spacing={1}>
				{courses.map(course => {
					return (
						<Grid key={course} item xs={12} md={6}>
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
				<p className="notification">{`You have not added any courses. Add courses to view office hours.`}</p>
				<Button variant="contained" color="secondary" onClick={() => { AddCourses() }}>Add Courses</Button>
			</div>
		)
	} else {
		return (
			<div className="content">
				<p className="notification">Please sign in to see the course list</p>
				<Button variant="contained" color="primary" onClick={() => { SignInWithGoogle() }}>Sign In</Button>
			</div>
		)
	}
}

export default CourseList;
