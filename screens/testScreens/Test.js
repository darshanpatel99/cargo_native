import React, { Component } from 'react';
import { View, Button, Text, TextInput, Image, StyleSheet } from 'react-native';
import Stripe from '../../components/payments/stripe';

export default class TestScreen extends React.Component {
  
  constructor(){
    super();
  }

  render(){
    return(
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}><Stripe/></View>
    )
  }
  
}

