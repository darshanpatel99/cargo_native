import React, { Component } from 'react';
import { View, Button, Text, TouchableOpacity, StyleSheet } from 'react-native';
import firebase from '../../Firebase';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class TestScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      showAlert: true,
      User: null 
    };
    this.showAlert = this.showAlert.bind(this);
  };

  showAlert(){
    this.setState({
      showAlert: true
    });
  };

  hideAlert(){
    const { navigate } = this.props.navigation;
    this.setState({
      showAlert: true
    });
    navigate('Account');
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
    const {showAlert} = this.state;
    
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
       
        <View style={styles.container}>   
{/* 
        <TouchableOpacity onPress={() => {
          this.showAlert();
        }}>
          <View style={styles.button}>
            <Text style={styles.text}>Try me!</Text>
          </View>
        </TouchableOpacity> */}

          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Alert"
            message="Please login first!"
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="Go to login!!"
            confirmButtonColor="#DD6B55"
            onCancelPressed={() => {
              this.hideAlert();
            }}
            onConfirmPressed={() => {
              this.hideAlert();
            }}
          />
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
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: "#AEDEF4",
  },
  text: {
    color: '#fff',
    fontSize: 15
  },
})