import React, {Component} from 'react';
import {View, Text } from 'react-native';
import Stripe from '../../components/payments/stripe'

export default class TestScreen extends Component {

  constructor(){
    super();
  }

  render() {
    return(
      <View style= {styles.TestContainer}> 
        <Stripe/>
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
