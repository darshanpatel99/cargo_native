import React, { Component } from 'react';
import { View, Button, Text, TextInput, Image, ScrollView, WebView } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {Linking} from 'expo';
import firebase from '../../Firebase';

const captchaUrl = `https://cargo-488e8.firebaseapp.com/CarGoCaptcha.html?appurl=${Linking.makeUrl('')}`;

export default class PhoneAuth extends React.Component {
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
          <WebView>
              source={{uri: 'https://github.com/facebook/react-native'}}
              style={{marginTop: 20}}
          </WebView>


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
