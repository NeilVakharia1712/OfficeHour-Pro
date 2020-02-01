import React from 'react';
import { Button, Radio, FormControlLabel, RadioGroup } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const FormDialog = () => {
	const [open, setOpen] = React.useState(false);
	const [weekday, setWeekday] = React.useState('mo');

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleChangeWeekday = event => {
    setWeekday(event.target.value);
	};
	
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
					<form noValidate autoComplete="off">
						<TextField id="standard-basic" label="Instructor" />
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
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default FormDialog
