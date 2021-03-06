import React from 'react';
import { View, Text,  StyleSheet } from 'react-native';

import firebase from '../../Firebase';
import * as Facebook from 'expo-facebook';



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
 
  loginAsync = async () => {
    console.log('in loginAsync() method');
    // First we login to facebook and get an "Auth Token" then we use that token to create an account or login. This concept can be applied to github, twitter, google, ect...
    const token = await this.facebookLogin();

    if (!token) return;
    // Use the facebook token to authenticate our user in firebase.
    const credential = firebase.auth.FacebookAuthProvider.credential(token);
    try {
      // login with credential
      await firebase.auth().signInWithCredential(credential);
    } catch ({ message }) {
      alert(message);
    }
  };
 
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
      <View style={styles.viewStyle}>
        <Text onPress={this.toggleAuth}>{message}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  }
})