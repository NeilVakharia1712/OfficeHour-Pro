import React, { useState, useEffect } from 'react';
import { Container } from '@material-ui/core';
import firebase from 'firebase/app';
import ButtonAppBar from './components/AppBar';

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
    <Container>
      <ButtonAppBar user={user}/>
      <div>
        <h1>This is our OfficeHours Pro</h1>
        <h3>CS 394: Agile Software Development</h3>
        <h3>CS 340: Introduction to Computer Networking</h3>
      </div>
    </Container>
  )
};

export default App;
