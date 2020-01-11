import React from 'react';
import firebase from 'firebase/app'
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const SignIn = () => (
	<StyledFirebaseAuth
		uiConfig={uiConfig}
		firebaseAuth={firebase.auth()}
	/>
);

const SignOut = () => {
    firebase.auth().signOut()
}

const uiConfig = {
	signInFlow: 'popup',
	signInOptions: [
		firebase.auth.GoogleAuthProvider.PROVIDER_ID
	],
	callbacks: {
		signInSuccessWithAuthResult: () => false
	}
};

export default SignIn;
export {SignOut, SignIn};