import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import '../App.css';

const useStyles = makeStyles(theme => ({
	root: {
		'& > *': {
			margin: theme.spacing(1),
		},
	},
	extendedIcon: {
		marginRight: theme.spacing(1),
	},
	fab: {
		margin: 0,
		top: 'auto',
		right: 20,
		bottom: 20,
		left: 'auto',
		position: 'fixed'
	}
}));

const FloatingActionButtons = ({ mode, setMode }) => {
	const classes = useStyles();
	const switchMode = () =>{
		if(mode === false){
			setMode(true)
		}else{
			setMode(false)
		}
	}
	return (
		<div className={classes.root}>
			<Fab onClick={()=>switchMode()} className={classes.fab} color="secondary" aria-label="edit">
				{mode?<CheckIcon />:<AddIcon />}
			</Fab>
		</div>
	);
}

export default FloatingActionButtons
