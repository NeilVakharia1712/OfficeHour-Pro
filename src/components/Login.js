import React from 'react';
import firebase from 'firebase/app'
import 'firebase/auth';
import { Button } from '@material-ui/core';

const SignIn = () => (
    <Button style={{color: 'white'}} onClick={() => {SignInWithGoogle()}}>Sign In</Button>
);

const SignOut = () => {
    firebase.auth().signOut()
}

const SignInWithGoogle = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}

export default SignIn;
export {SignOut, SignIn, SignInWithGoogle};
