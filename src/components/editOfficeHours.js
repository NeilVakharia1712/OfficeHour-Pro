import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Select, MenuItem } from '@material-ui/core';
import {KeyboardTimePicker} from '@material-ui/pickers'

const FormDialog = () => {
	const [open, setOpen] = React.useState(false);

	const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));
	const [age, setAge] = React.useState('');
	const handleChange = event => {
    setAge(event.target.value);
  };

	const handleDateChange = date => {
		setSelectedDate(date);
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Button variant="outlined" color="primary" onClick={handleClickOpen}>
				Open form dialog
      </Button>
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Edit</DialogTitle>
				<DialogContent>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={age}
						onChange={handleChange}
					>
						<MenuItem value={10}>Ten</MenuItem>
						<MenuItem value={20}>Twenty</MenuItem>
						<MenuItem value={30}>Thirty</MenuItem>
					</Select>
					<KeyboardTimePicker
						margin="normal"
						id="time-picker"
						label="Start time"
						value={selectedDate}
						onChange={handleDateChange}
						KeyboardButtonProps={{
							'aria-label': 'change time',
						}}
					/>
					<KeyboardTimePicker
						margin="normal"
						id="time-picker"
						label="End time"
						value={selectedDate}
						onChange={handleDateChange}
						KeyboardButtonProps={{
							'aria-label': 'change time',
						}}
					/>
					<TextField
						margin="dense"
						id=""
						label="TA/Prof"
						fullWidth
					/>
					<TextField
						margin="dense"
						id="name"
						label="Location"
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
          </Button>
					<Button onClick={handleClose} color="primary">
						Subscribe
          </Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default FormDialog
