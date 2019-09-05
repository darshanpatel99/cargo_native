import React, {Component} from 'react';
import {View, Text, Button } from 'react-native';
import Stripe from '../../components/payments/stripe'
import firebase from '../../Firebase.js';
//import { Button } from 'react-native-elements';
// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};




export default class TestScreen extends Component {

  constructor(){
    super();
  }

  async logoutAsync(props) {
    try {
      await firebase.auth().signOut();    
    } catch ({ message }) {
      alert(message);
    }
  }


  render() {
    return(
      <View style= {styles.TestContainer}> 
        <Button  title='Logout' onPress={this.logoutAsync}/>
      </View>
    )
  }
}

const styles = {
  TestContainer: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  }
}
