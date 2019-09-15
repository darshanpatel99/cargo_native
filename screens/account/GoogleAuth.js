import React from 'react';
import { View,Text} from 'react-native';

import firebase from '../../Firebase';
import * as Facebook from 'expo-facebook';
//import * as Google from 'expo-google-app-auth';
import {Google} from 'expo';

export default class TestScreen extends React.Component {
  state = { user: null };
  FacebookApiKey= '2872116616149463';
  componentDidMount() {
    // List to the authentication state
    this._unsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }
 
  componentWillUnmount() {
    // Clean up: remove the listener
    this._unsubscribe();
  }
 
  onAuthStateChanged = user => {
    // if the user logs in or out, this will be called and the state will update.
    // This value can also be accessed via: firebase.auth().currentUser
    this.setState({ user });
  };
 
  //facebook login function
  async facebookLogin() {
    console.log("in facebookLogin() method");
    try{
      const authData = await Facebook.logInWithReadPermissionsAsync(this.FacebookApiKey);
    
      console.log(authData);
      if (!authData) return;
      const { type, token } = authData;
      if (type === 'success') {
        console.log('facebook auth success and the token is' + token);
        return token;
      } else {
        // Maybe the user cancelled...
      }
    }
    catch(message){
      console.log(message);
      alert(message);
      
    }
  }

  //google login function
  async googleLogin(){

      try{
        //Method 1
        // await GoogleSignIn.initAsync({
        //   clientId:'572236256696-m327o3i0d6qvb73qu366hqmhvb47v38f.apps.googleusercontent.com'
        // });

        // await GoogleSignIn.askForPlayServicesAsync();
        // const {type, user} = await GoogleSignIn.signInAsync();


        //Method 2
        const config ={
            expoClientId:'572236256696-192r30h6n62sreo89ctqcoq4e83jqrso.apps.googleusercontent.com',
            iosClientId:'572236256696-fergtsju84ade8lnro6au83sdaknnn4i.apps.googleusercontent.com',
            androidClientId:'572236256696-rh7v7sgsr0fj2v1crgvgh8efgpp831uk.apps.googleusercontent.com',
            scopes:['profile', 'email']
        };

        const {type, accessToken} = await Google.logInAsync(config);




        if(type=='success'){
          alert('You got looged in with google');
          return accessToken;
        }
      }catch({message}){
        alert('login' + message);
      }

  }
 
  //checking if user equal function
   isUserEqual(googleUser, firebaseUser){
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  //Login function
  loginAsync = async () => {
    console.log('in loginAsync() method');
    // First we login to facebook and get an "Auth Token" then we use that token to create an account or login. This concept can be applied to github, twitter, google, ect...
    const accessToken = await this.googleLogin();

    if (!accessToken) return;
    // Use the facebook token to authenticate our user in firebase.
    const credential = firebase.auth.GoogleAuthProvider.credential(null,accessToken);
    try {
      // login with credential
      await firebase.auth().signInWithCredential(credential);
    } catch ({ message }) {
      alert(message);
    }
  };
 

  //logout function
  async logoutAsync() {
    try {
      await firebase.auth().signOut();
    } catch ({ message }) {
      alert(message);
    }
  }
 
  toggleAuth = () => {
    if (!!this.state.user) {
      this.logoutAsync();
    } else {
      this.loginAsync();
    }
  };
 
  render() {
    const { user } = this.state;
    const message = !!user ? 'Logout' : 'Login';
    return (
      <View style= {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text onPress={this.toggleAuth}>{message}</Text>
      </View>
    )
  }
  
}

