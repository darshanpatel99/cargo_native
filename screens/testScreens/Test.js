import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';
import {AppAuth} from 'expo-app-auth';


export default class TestScreen extends React.Component{
  state = { user: null };

  componentDidMount() {
    this.initAsync();
    console.log("componentDidMount working");
  }

  initAsync = async () => {  
    try{
      await GoogleSignIn.initAsync({
        clientId: '572236256696-m327o3i0d6qvb73qu366hqmhvb47v38f.apps.googleusercontent.com'
      });
    }
    catch({message}){
      alert('GoogleSignIn.initAsync():  '+ message );
    }
    console.log('initAsync Working!');
    this._syncUserWithStateAsync();
  };

  _syncUserWithStateAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync();
    this.setState({ user });
  };

  signOutAsync = async () => {
    await GoogleSignIn.signOutAsync();
    this.setState({ user: null });
  };

  signInAsync = async () => {
    try {

      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        this._syncUserWithStateAsync();
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  };

  onPress = () => {
    if (this.state.user) {
      this.signOutAsync();
    } else {
      this.signInAsync();
    }
  };

  render() {
    return (
    <View style={styles.viewStyle} >
    <Text  onPress={this.onPress}>Toggle Auth</Text>

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

