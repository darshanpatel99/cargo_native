import React, { Component } from 'react';
<<<<<<< HEAD
import { View, Button, Text, TextInput, Image, ScrollView } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {Linking} from 'expo';
import firebase from '../../Firebase';

const captchaUrl = `https://cargo-488e8.firebaseapp.com/CarGoCaptcha.html?appurl=${Linking.makeUrl('')}`;

export default class TestScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        user: undefined,
        phone: '',
        confirmationResult: undefined,
        code: '',
        Token: '',
        valid:false
    }
    this.captcahRef = firebase.firestore().collection('reCaptcha').doc('YksTcYBgjxD6Oj26zmzl');
      //things need to be bit more clear here
      this.captcahRef.onSnapshot((doc)=>{
       console.log(this.state.valid);
        if(this.state.valid){
          this.setState({valid:false, Token: doc.data().Token});
          this.onTokenReceived(this.state.Token);         
          console.log('Go the valid token');
        }
        else{
        this.setState({Token: doc.data().Token, valid:true});
        }
        console.log(this.state.Token);
     
    });
}

onPhoneChange = (phone) => {
    this.setState({phone});
}

//listnener for the url change
tokenListener = ({url}) =>{
    // console.log('In the listener');
    // WebBrowser.dismissBrowser();
    // const tokenEncoded = Linking.parse(url).queryParams['token'];
    // console.log(tokenEncoded);
    // console.log(url);
    // if (tokenEncoded)
    //     token = decodeURIComponent(tokenEncoded);
}


//Do the phone Verfiication
onTokenReceived = async (token) =>{
  
  console.log("Token has been received");
  const {phone} = this.state;
  //fake firebase.auth.ApplicationVerifier
  const captchaVerifier = {
      type: 'recaptcha',
      verify: () => Promise.resolve(token)
  }
  try {
      const confirmationResult = await firebase.auth().signInWithPhoneNumber(phone, captchaVerifier);
      console.log(confirmationResult);
      this.setState({confirmationResult});
  } catch (e) {
      console.warn(e);
  }

}

onPhoneComplete = async () => {
    let token = null
    
    Linking.addEventListener('url', this.tokenListener);   
    console.log('opening web browser');
    await WebBrowser.openBrowserAsync(captchaUrl);
    Linking.removeEventListener('url', this.tokenListener);  

}
onCodeChange = (code) => {
    this.setState({code});
}
onSignIn = async () => {
    const {confirmationResult, code} = this.state;
    try {
        await confirmationResult.confirm(code);
    } catch (e) {
        console.warn(e);
    }
    this.reset();
}
reset = () => {
    this.setState({
        phone: '',
        phoneCompleted: false,
        confirmationResult: undefined,
        code: ''
    });
}

render() {
    if (this.state.user)
        return (
          <ScrollView style={{padding: 20, marginTop: 20}}>
          <TextInput
              value={this.state.phone}
              onChangeText={this.onPhoneChange}
              keyboardType="phone-pad"
              placeholder="Your phone"
          />
          <Button
              onPress={this.onPhoneComplete}
              title="Next"
          />
      </ScrollView>
        )

    if (!this.state.confirmationResult)
        return (
            <ScrollView style={{padding: 20, marginTop: 20}}>
                <TextInput
                    value={this.state.phone}
                    onChangeText={this.onPhoneChange}
                    keyboardType="phone-pad"
                    placeholder="Your phone"
                />
                <Button
                    onPress={this.onPhoneComplete}
                    title="Next"
                />
            </ScrollView>
        )
    else
        return (
            <ScrollView style={{padding: 20, marginTop: 20}}>
                <TextInput
                    value={this.state.code}
                    onChangeText={this.onCodeChange}
                    keyboardType="numeric"
                    placeholder="Code from SMS"
                />
                <Button
                    onPress={this.onSignIn}
                    title="Sign in"
                />
            </ScrollView>
        )
}
}
=======
import { View, Button, Text, TextInput, Image, StyleSheet } from 'react-native';

import firebase from '../../Firebase';
import * as Facebook from 'expo-facebook';


const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';

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
>>>>>>> facebook-auth-working
