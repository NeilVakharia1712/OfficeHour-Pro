import React from 'react'
import { Grid } from '@material-ui/core'
import CourseCard from './CourseCard'

const AllCourseList = ({ schedule, user }) => {
	if (schedule) {
		return (
			<Grid container spacing={1}>
				{Object.values(schedule).map(course => {
					return (
						<Grid key={course['id']} item xs={12}>
							<CourseCard
								courseNumber={course['id']}
								courseName={course['title']}
								officeHours={course['officeHours']}
								user={user}
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