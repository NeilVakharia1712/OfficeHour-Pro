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
	const [isProf, setIsProf] = useState(false);

	useEffect(() => {
		firebase.auth().onAuthStateChanged(setUser);
	}, []);

	useEffect(() => {
		const getCourseInfo = snapshot => {
			if (snapshot.val()) setSchedule(snapshot.val());
			console.log("hello")
		}
		const courseDb = firebase.database().ref('courses');
		courseDb.on("value", getCourseInfo, error => alert(error));
	}, [])

	const verifyEmail = (email) => {
		const re = /u.northwestern.edu/g;
		return re.test(email)
	}

	useEffect(() => {
		if (user) {
			setIsProf(verifyEmail(user.email))
			const updateUserCourse = (snapshot) => {
				if (snapshot.val()) {
					setCourse(snapshot.val().courses)
					console.log(snapshot.val())
					setCheckedInCourse(snapshot.val().checkedInCourse);
				}
				else{
					setCourse([]);
					setCheckedInCourse(null);
				}
			}
			const userDb = firebase.database().ref('Users/' + user.uid);
			userDb.on('value', updateUserCourse);
		}
	}, [user])

	return (
    <Container disableGutters>
      <ButtonAppBar user={user} />
      <Slide direction="left" in={!mode} mountOnEnter unmountOnExit>
        <div>
          <CourseList
            user={user}
            schedule={schedule}
            courses={courses}
            setCourse={setCourse}
            checkedInCourse={checkedInCourse}
            mode={mode}
            setMode={setMode}
            isProf={isProf}
          />
        </div>
      </Slide>
      <Slide direction="right" in={mode} mountOnEnter unmountOnExit>
        <div>
          <AllCourseList schedule={schedule} user={user} courses={courses} isProf={isProf} />
        </div>
      </Slide>
      {user ? <FloatingActionButtons mode={mode} setMode={setMode} /> : <></>}
    </Container>
  );
};

export default App;
