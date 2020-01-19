import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';

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
		console.log(mode)
	}
	return (
		<div className={classes.root}>
			<Fab onClick={()=>switchMode()}className={classes.fab} color="secondary" aria-label="edit">
				<EditIcon />
			</Fab>
		</div>
	);
}

export default FloatingActionButtons