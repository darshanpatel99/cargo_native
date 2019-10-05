import React from 'react';
import {Image, View, Linking, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button } from "native-base";
import Colors from "../../constants/Colors";
import MyWeb from './TestWebView'

export default class TestScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  render(){
    return (
      <MyWeb />
    )
  }



}

const styles = {
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
//    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoStyle:{
    flex:0.7,
    
    justifyContent:'center',
  
  },
  buttonsWithLogo:{
    flex:0.3,
    
    justifyContent:'center',
  },

  lightText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 1.2
  },
  button: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    height: 50,
    width: Dimensions.get('window').width - 100,
    margin: 5,
    backgroundColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5
  },

}