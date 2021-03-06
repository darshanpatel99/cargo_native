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
      TotalCartAmount,
      BuyerName: BuyerName,
      SellerAddress: SellerAddress,
      Title: Title,
      Email:Email,
      productID:productID,
      userId:userId,
      deliveryFee,
      GPSStringFormat,
    }
  }

  render() {
    return(
    //   <DismissKeyboard>
    //   <View style= {styles.TestContainer}> 
    //     <Stripe deliveryFee={this.state.deliveryFee} GPSStringFormat={this.state.GPSStringFormat} Email ={this.state.Email} Title= {this.state.Title} SellerAddress ={this.state.SellerAddress} charge = {this.state.TotalAmount} BuyerName= {this.state.BuyerName} navigation={this.props.navigation} productID={this.state.productID} userId ={this.state.userId}/>
    //     {/* <TestWebView/> */}
    //   </View>
    //   </DismissKeyboard>
    //     //<TestWebView TotalCartAmount={this.state.TotalCartAmount}/>
    // )
        //<TestWebView TotalCartAmount={this.state.TotalCartAmount} navigation={this.props.navigation}/>
        <DismissKeyboard>
        <View style= {styles.TestContainer}>
          <Stripe TotalCartAmount={this.state.TotalCartAmount} deliveryFee={this.state.deliveryFee} GPSStringFormat={this.state.GPSStringFormat} Email ={this.state.Email} Title= {this.state.Title} SellerAddress ={this.state.SellerAddress} charge = {this.state.TotalAmount} BuyerName= {this.state.BuyerName} navigation={this.props.navigation} productID={this.state.productID} userId ={this.state.userId}/>
          {/* <TestWebView/> */}
        </View>
        </DismissKeyboard>
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
