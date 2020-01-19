import React, { useState, useEffect } from 'react';
import { Container, Slide } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/database';
import ButtonAppBar from './components/AppBar';
import CourseList from './components/CourseList';
import './App.css';
import FloatingActionButtons from './components/FloatingActionButton';
import AllCourseList from './components/AllCourseList';

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
	const [mode, setMode] = useState(false);
	const [schedule, setSchedule] = useState(null);
	const [courses, setCourse] = useState([]);
    const [checkedInCourse, setCheckedInCourse] = useState(null);

	useEffect(() => {
		firebase.auth().onAuthStateChanged(setUser);
	}, []);

	useEffect(() => {
		const getCourseInfo = snapshot => {
			if (snapshot.val()) setSchedule(snapshot.val());
		}
		const courseDb = firebase.database().ref('courses');
		courseDb.once("value", getCourseInfo, error => alert(error));
	}, [])

    useEffect(() => {
        if (user) {
            const userDb = firebase.database().ref('Users/' + user.uid);
            userDb.once('value').then(snapshot => {
                if (snapshot.val()) {
                    setCourse(snapshot.val().courses)
                    setCheckedInCourse(snapshot.val().checkedInCourse);
                }
            })
        }
        // eslint-disable-next-line
    }, [user])

	return (
		<Container disableGutters>
			<ButtonAppBar user={user} />
			<Slide direction="left" in={!mode} mountOnEnter unmountOnExit>
				<div><CourseList user={user} schedule={schedule} courses={courses} checkedInCourse={checkedInCourse}/></div>
			</Slide>
			<Slide direction="right" in={mode} mountOnEnter unmountOnExit>
				<div><AllCourseList schedule={schedule} user={user} courses={courses}/></div>
			</Slide>
			<FloatingActionButtons mode={mode} setMode={setMode} />
		</Container>
	)
};

export default App;
