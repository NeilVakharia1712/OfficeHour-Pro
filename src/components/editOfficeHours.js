import React from 'react';
import { Button, Radio, FormControlLabel, RadioGroup, ListItem, List } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const FormDialog = () => {
	const [open, setOpen] = React.useState(false);
	const [weekday, setWeekday] = React.useState('mo');
	const [instructor, setInstructor] = React.useState('')
	const [email, setEmail] = React.useState('')
	const [start, setStart] = React.useState('00:00')
	const [end, setEnd] = React.useState('00:00')
	const [location, setLocation] = React.useState('')

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

	const handleChangeStart = event => {
		console.log(event.target.value)
		setStart(event.target.value)
	}

	const handleChangeEnd = event => {
		setEnd(event.target.value)
	}

	const handleChangeLocation = event => {
		setLocation(event.target.value)
	}

	return (
		<div>
			<Button variant="outlined" color="primary" onClick={handleClickOpen}>
				Edit
      </Button>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Edit Office Hours</DialogTitle>
				<DialogContent>
					<List>
						<ListItem>
							<TextField varient='outlined' id="standard-basic" label="Instructor" value={instructor} onChange={handleChangeInstructor}/>
						</ListItem>
						<ListItem>
							<TextField varient='outlined' id="standard-basic" label="Instructor Email" value={email} onChange={handleChangeEmail}/>
						</ListItem>
						<ListItem>
							<RadioGroup row aria-label="gender" name="gender2" value={weekday} onChange={handleChangeWeekday}>
								<FormControlLabel
									value="mo"
									control={<Radio color="primary" />}
									label="Mo"
								/>
								<FormControlLabel
									value="tu"
									control={<Radio color="primary" />}
									label="Tu"
								/>
								<FormControlLabel
									value="we"
									control={<Radio color="primary" />}
									label="We"
								/>
								<FormControlLabel
									value="th"
									control={<Radio color="primary" />}
									label="Th"
								/>
								<FormControlLabel
									value="fr"
									control={<Radio color="primary" />}
									label="Fr"
								/>
							</RadioGroup>
						</ListItem>
						<ListItem>
							<TextField
								varient='outlined'
								id="time"
								label="Start Time"
								type="time"
								InputLabelProps={{
									shrink: true,
								}}
								inputProps={{
									step: 300, // 5 min
								}}
								onChange={handleChangeStart}
								value={start}
							/>
						</ListItem>
						<ListItem>
							<TextField
								varient='outlined'
								id="time"
								label="End Time"
								type="time"
								InputLabelProps={{
									shrink: true,
								}}
								inputProps={{
									step: 300, // 5 min
								}}
								onChange={handleChangeEnd}
								value={end}
							/>
						</ListItem>
						<ListItem>
							<TextField varient='outlined' id="standard-basic" label="Location" value={location} onChange={handleChangeLocation}/>
						</ListItem>
					</List>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default FormDialog
