import React, { useState, useEffect } from 'react';
import { Container } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/database';
import ButtonAppBar from './components/AppBar';
import CourseList from './components/CourseList';

const firebaseConfig = {
	apiKey: "AIzaSyD4Ph2v9VLa0EkAcyVNVV4D31xTc6z7cak",
	authDomain: "quickreact-dcd6c.firebaseapp.com",
	databaseURL: "https://quickreact-dcd6c.firebaseio.com",
	projectId: "quickreact-dcd6c",
	storageBucket: "quickreact-dcd6c.appspot.com",
	messagingSenderId: "1060437748264",
	appId: "1:1060437748264:web:893a5504749d21242d231d",
	measurementId: "G-SCTCHS94VX"
};
firebase.initializeApp(firebaseConfig);

const App = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		firebase.auth().onAuthStateChanged(setUser);
	}, []);

	return (
		<Container disableGutters>
			<ButtonAppBar user={user} />
			<CourseList user={user}/>
		</Container>
	)
};

export default App;
