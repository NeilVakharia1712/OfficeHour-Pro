import React from "react";
import { Grid } from "@material-ui/core";
import CourseCard from "./CourseCard";
import AddCourse from "./AddCourse";

const AllCourseList = ({ schedule, user, courses, isProf }) => {
  if (schedule && courses) {
    return (
      <Grid
        style={{ padding: "15px 10px 15px 10px" }}
        className="course-container"
        container
        spacing={1}
      >
        {Object.values(schedule).map(course => {
          return (
            <Grid key={course["id"]} item xs={12} md={6}>
              <CourseCard
                courseNumber={course["id"]}
                courseName={course["title"]}
                officeHours={course["officeHours"]}
                user={user}
                isEnrolled={courses.includes(course["id"]) ? true : false}
              />
            </Grid>
          );
        })}
        {isProf ? (
          <Grid
            container
            justify="center"
            style={{ padding: "15px 10px 15px 10px" }}
          >
            <AddCourse />
          </Grid>
        ) : null}
      </Grid>
    );
  } else {
    return null;
  }
};

export default AllCourseList;
