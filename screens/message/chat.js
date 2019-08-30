import React, { Component } from 'react';
import { View, Button, Text, TextInput, Image, StyleSheet } from 'react-native';
import firebase from '../../Firebase';


export default class TestScreen extends React.Component {

  state = { 
    User: null 
  };
 
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
    this.setState({ User: user });
  };
 
  loginAsync = async () => {
    const { navigate } = this.props.navigation;
    navigate('Account');
  };
 
 
  render() {
    const { user } = this.state;
    const message = !!user ? 'Logout' : 'Login';
    if(this.state.User != null){
        console.log('User is logged in, From chat screen');
        return (

            <View style={styles.viewStyle}>
                <Text>Hello user logged in</Text>
            </View>
        
        );
    }
    else{
        return (   
            <View style={styles.viewStyle}>
              <Button title = "Go to login" onPress={() => this.props.navigation.navigate('Account')} />
            </View>  
          );

    }
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