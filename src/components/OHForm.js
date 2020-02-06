import React from 'react';
import { Button, Select, MenuItem, ListItem, List, FormControl, InputLabel, DialogActions } from '@material-ui/core';
import { MuiPickersUtilsProvider, MobileTimePicker } from "@material-ui/pickers";
import "firebase/database";
import firebase from "firebase/app";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from '@date-io/date-fns';

const OHForm = ({ courseNumber, sessionId, officeHours }) => {
	let isEdit = !(typeof (officeHours) == "undefined")
	const [open, setOpen] = React.useState(false);
	const [weekday, setWeekday] = React.useState(isEdit ? officeHours.weekDay : '');
	const [instructor, setInstructor] = React.useState(isEdit ? officeHours.TAProf : '')
	const [instructorName, setInstructorName] = React.useState(isEdit ? officeHours.instructorName : '')
	const [email, setEmail] = React.useState(isEdit ? officeHours.email : '')
	const [start, setStart] = React.useState(isEdit ? new Date("2018-01-01T" + officeHours.startTime + ":00") : new Date("2018-01-01T00:00:00"))
	const [end, setEnd] = React.useState(isEdit ? new Date("2018-01-01T" + officeHours.endTime + ":00") : new Date("2018-01-01T00:00:00"))
	const [location, setLocation] = React.useState(isEdit ? officeHours.location : '')

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleChangeWeekday = event => {
		setWeekday(event.target.value);
	};

	const handleChangeInstructor = event => {
		setInstructor(event.target.value)
	}

	const handleChangeEmail = event => {
		setEmail(event.target.value)
	}

	const handleChangeLocation = event => {
		setLocation(event.target.value)
	}

	const handleChangeInstructorName = event => {
		setInstructorName(event.target.value)
	}

	const addOfficeHourSession = (courseNumber) => {
		const ref = firebase.database().ref("courses/" + courseNumber);
		const uuidv4 = require('uuid/v4');
		const sessionId = uuidv4();
		const startTime = start.toTimeString().split(' ')[0].slice(0, 5);
		const endTime = end.toTimeString().split(' ')[0].slice(0, 5);
		ref.once("value", snapshot => {
			var data = {
				TAProf: instructor,
				endTime: endTime,
				location: location,
				startTime: startTime,
				instructorName: instructorName,
				email: email,
				weekDay: weekday
			};
			var newSession = {};
			newSession['officeHours/' + sessionId] = data;
			ref.update(newSession)
			handleClose();
		})
	}

	const editOfficeHourSession = (sessionId, courseNumber) => {
		const ref = firebase.database().ref("courses/" + courseNumber);
		const startTime = start.toTimeString().split(' ')[0].slice(0, 5);
		const endTime = end.toTimeString().split(' ')[0].slice(0, 5);
		ref.once("value", snapshot => {
			var data = {
				TAProf: instructor,
				endTime: endTime,
				location: location,
				startTime: startTime,
				instructorName: instructorName,
				email: email,
				weekDay: weekday
			};
			var editSession = {};
			editSession["officeHours/" + sessionId] = data;
			ref.update(editSession);
			handleClose();
		});
	}

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<Button size='small' color="primary" onClick={handleClickOpen}>
				{isEdit ? 'Edit' : 'Add office hours session'}
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
			>
				<DialogTitle id="alert-dialog-title">Edit Office Hours</DialogTitle>
				<DialogContent>
					<List>
						<ListItem>
							<FormControl style={{ width: '100%' }}>
								<InputLabel id="weekday-label">Instructor</InputLabel>
								<Select
									labelId="weekday-label"
									id="weekday"
									value={instructor}
									onChange={handleChangeInstructor}
								>
									<MenuItem value={'TA'}>TA</MenuItem>
									<MenuItem value={'Prof'}>Professor</MenuItem>
								</Select>
							</FormControl>
						</ListItem>
						<ListItem>
							<TextField label="Instructor Name" value={instructorName} onChange={handleChangeInstructorName} />
						</ListItem>
						<ListItem>
							<TextField label="Instructor Email" value={email} onChange={handleChangeEmail} />
						</ListItem>
						<ListItem>
							<FormControl style={{ width: '100%' }}>
								<InputLabel id="weekday-label">WeekDay</InputLabel>
								<Select
									labelId="weekday-label"
									id="weekday"
									value={weekday}
									onChange={handleChangeWeekday}
								>
									<MenuItem value={'mo'}>Monday</MenuItem>
									<MenuItem value={'tu'}>Tuesday</MenuItem>
									<MenuItem value={'we'}>Wednesday</MenuItem>
									<MenuItem value={'th'}>Thursday</MenuItem>
									<MenuItem value={'fr'}>Friday</MenuItem>
									<MenuItem value={'sa'}>Saturday</MenuItem>
									<MenuItem value={'su'}>Sunday</MenuItem>
								</Select>
							</FormControl>
						</ListItem>
						<ListItem>
							<MobileTimePicker
								label="Start Time"
								value={start}
								minutesStep={5}
								onChange={setStart}
							/>
						</ListItem>
						<ListItem>
							<MobileTimePicker
								label="End Time"
								value={end}
								minutesStep={5}
								onChange={setEnd}
							/>
						</ListItem>
						<ListItem>
							<TextField id="standard-basic" label="Location" value={location} onChange={handleChangeLocation} />
						</ListItem>
					</List>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => { setOpen(false) }}>Cancel</Button>
					{
						isEdit ? (
							<Button
								variant="contained"
								color="secondary"
								onClick={() => { editOfficeHourSession(sessionId, courseNumber) }}>
								Submit
              </Button>
						) : (
								<Button
									variant="contained"
									color="secondary"
									onClick={() => { addOfficeHourSession(courseNumber) }}>
									Submit
              </Button>
							)
					}
				</DialogActions>
			</Dialog>
		</MuiPickersUtilsProvider>
	)
}

export default OHForm
