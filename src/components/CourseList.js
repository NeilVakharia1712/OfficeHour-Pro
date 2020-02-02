import React from 'react'
import { Button } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CourseCard from './CourseCard';
import { SignInWithGoogle } from './Login'
import '../App.css';
import "rbx/index.css";
import { Column } from "rbx";

const CourseList = ({
  user,
  schedule,
  courses,
  checkedInCourse,
  mode,
  setMode
}) => {
  const AddCourses = () => {
    setMode(true);
  };

  if (user && schedule && courses && courses.length !== 0) {
    const length = courses.length;
    return (
        <Column.Group style={{ margin: "5px", background: "white" }}>
          <Column style={{ padding:"0px 5px 0px" }}>
            {courses.slice(0, Math.ceil(length / 2)).map(course => {
              return (
                <CourseCard
                  key={course}
                  courseNumber={course}
                  courseName={schedule[course]["title"]}
                  officeHours={schedule[course]["officeHours"]}
                  user={user}
                  isCheckedIn={course === checkedInCourse}
                  mode="CourseList"
                />
              );
            })}
          </Column>
          <Column style={{ padding:"0px 5px 0px" }}>
            {courses.slice(Math.ceil(length / 2), length).map(course => {
              return (
                <CourseCard
                  key={course}
                  courseNumber={course}
                  courseName={schedule[course]["title"]}
                  officeHours={schedule[course]["officeHours"]}
                  user={user}
                  isCheckedIn={course === checkedInCourse}
                  mode="CourseList"
                />
              );
            })}
          </Column>
        </Column.Group>
    );
} else if (user && schedule) {
	return (
		<div className="content">
			<span className="tip">Add a course to begin</span>
			<ArrowForwardIcon className="arrow_icon"/>
		</div>
	)
} else {
	return (
		<div className="sign_in">
			<p className="notification">Please sign in to see the course list</p>
			<Button variant="contained" color="primary" onClick={() => { SignInWithGoogle() }}>Sign In</Button>
		</div>
	)
}
};

export default CourseList;
