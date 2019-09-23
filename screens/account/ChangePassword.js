import React, { Component } from 'react';
import { View, Keyboard, TouchableWithoutFeedback, Dimensions, TextInput } from 'react-native';
import Colors from "../../constants/Colors.js";
import { Button, Text } from "native-base";
import firebase from '../../Firebase.js';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
 );

export default class ChangePasswordScreen extends Component {
  //constructor
  constructor(props) {
    super(props);
    this.state={
      email:'',
    }
  }

  /**
   * function Description: Send the email with the link to change the password
   */
  sendPasswordResetEmail=()=>{

    //sending password rest link to the email
    var auth = firebase.auth();
    var email = this.state.email;
    //change the password it is here just for testing purposes
    auth.sendPasswordResetEmail(email).then(()=>{
      console.log('password reset email sent');
    }).catch((error)=>{
      console.log('Got the following error while sending password reset email: '+ error);
      alert(error);
    });

  }


  render() {
    return (

      <DismissKeyboard>

      <View style={styles.viewStyle}>

        <View style={styles.container}>
            <TextInput
                placeholder= 'Email'
                underlineColorAndroid="transparent"
                autoCapitalize='none'
                autoCorrect={false}
                style={styles.TextInputStyle}
                onChangeText = {email => this.setState({email:email.trim()})}
                />
        </View>

        <Button large-green style={styles.button} onPress={this.sendPasswordResetEmail()}>
            <Text style={styles.lightText} >Send Email</Text>
        </Button> 

      </View>
      </DismissKeyboard>
    );
  }
}

const styles = {
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  TextInputStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    height: 50,
    width: Dimensions.get('window').width - 100,
    borderRadius: 20,
    margin: 10,
    backgroundColor: "#f8f8f8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
  },
  container: {
    flex: 0, 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    height: 50,
    width: Dimensions.get('window').width - 100,
    margin:10,
    backgroundColor: "#f8f8f8",
  },
  button: {
    width: Dimensions.get('window').width - 100,
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    height: 50,
    margin: 5,
    backgroundColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5
  },
  lightText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 1.2
  },
};