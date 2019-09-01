import React, {Component} from 'react';
import {View, Text } from 'react-native';
import Stripe from '../../components/payments/stripe'


export default class StripeScreen extends Component {


  constructor(props){
    super(props);

    const { navigation } = this.props;
    const TotalCartAmount = parseInt(navigation.getParam('TotalCartAmount')) ;

    this.state= {
      TotalAmount: TotalCartAmount
    }
  }

  render() {
    return(
      <View style= {styles.TestContainer}> 
        <Stripe charge = {this.state.TotalAmount}/>
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
