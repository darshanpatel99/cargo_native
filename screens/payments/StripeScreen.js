import React, {Component} from 'react';
import {View, Keyboard,  TouchableWithoutFeedback,Dimensions } from 'react-native';
import Stripe from '../../components/payments/stripe'
import TestWebView from './TestWebView';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default class StripeScreen extends Component {

  constructor(props){
    super(props);
    const { navigation } = this.props;
    const TotalCartAmount = parseFloat(navigation.getParam('TotalCartAmount')) ;
    const BuyerName = navigation.getParam('BuyerName');
    const Title = navigation.getParam('Title');
    const SellerAddress = navigation.getParam('sellerAddress');
    const Email = navigation.getParam('Email');
    const productID = navigation.getParam('productID');
    const userId = navigation.getParam('userId');
    const GPSStringFormat = navigation.getParam('GPSStringFormat');
    const deliveryFee = navigation.getParam('deliveryFee');
    this.state={
      TotalAmount: TotalCartAmount,
      BuyerName: BuyerName,
      SellerAddress: SellerAddress,
      Title: Title,
      Email:Email,
      productID:productID,
      userId:userId,
      deliveryFee,
      GPSStringFormat
    }
  }

  render() {
    return(
        <TestWebView/>
    )
  }
}

const styles = {
  TestContainer: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    //justifyContent:'center'
    marginBottom:Dimensions.get('screen').height*0.2,
  }
}
