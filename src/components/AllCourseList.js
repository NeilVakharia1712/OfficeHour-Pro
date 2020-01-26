import React from 'react'
import { Grid } from '@material-ui/core'
import CourseCard from './CourseCard'

const AllCourseList = ({ schedule, user, courses }) => {
	console.log(courses)
	if (schedule) {
		return (
			<Grid style={{marginTop: '5px'}} className="course-container" container spacing={1}>
				{Object.values(schedule).map(course => {
					return (
						<Grid key={course['id']} item xs={12} md={6}>
							<CourseCard
								courseNumber={course['id']}
								courseName={course['title']}
								officeHours={course['officeHours']}
								user={user}
								isEnrolled={courses.includes(course['id'])?true:false}
							/>
						</Grid>)
				})
				}
			</Grid>
		)
	}else{
		return null
	}
}

export default AllCourseList
