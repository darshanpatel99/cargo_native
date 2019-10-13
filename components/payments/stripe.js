import React, { useState } from 'react';
import { View, Text, Alert, Keyboard,  TouchableWithoutFeedback} from 'react-native';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { StackActions, NavigationActions } from 'react-navigation';
import { Button } from 'native-base';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from "../../constants/Colors";
import firebase from '../../Firebase.js';
import firebaseChat from '../../FirebaseChat';
import PostTransaction from '../../functions/PostTransaction';
import AddJob from "../../functions/AddJob"


const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

var stripe = require('stripe-client')('pk_test_L2nP2Q4EJa9fa7TBGsLmsaBV00yAW5Pe6c');

export default class Stripe extends React.Component {
    
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const productID = navigation.getParam('productID');
    const userId = navigation.getParam('userId');
    const deliveryFee = navigation.getParam('deliveryFee');
    const GPSStringFormat = navigation.getParam('GPSStringFormat');
    const charge = navigation.getParam('charge');
    const TotalCartAmount = navigation.getParam('TotalCartAmount');
    
    this.state={
      showAlert: false,
      counter: 0,
      token:'',
      valid: false,
      card_number: 0,
      exp_month:0,
      exp_year:0,
      cvc: 0,
      name:'',
      paymentSuccess: false,
      loading: false,
      responseJson:'',
      productID: productID,
      userId:userId,
      BuyerAddress: GPSStringFormat,
      DeliveryFee: deliveryFee,
      TotalFee:charge,
      TotalCartAmount,
      GPSStringFormat,
      orderNumber:-1,
    }
    this.sendTokenToStripe = this.sendTokenToStripe.bind(this);
    this.onPayment = this.onPayment.bind(this);
    this.showAlert = this.showAlert.bind(this);
  }

  showAlert = () => {
    this.setState({
      loading:false,
      showAlert: true
    });
  };
  
  hideAlert = () => {
    const { navigate } = this.props.navigation;

    this.setState({
      showAlert: false
    });
    navigate('Home');
  };


    async onPayment() {
        //alert('Payment processed..')
        try{
        let information = {
          card: {
            number: this.state.card_number,
            exp_month: this.state.exp_month,
            exp_year: this.state.exp_year,
            cvc: this.state.cvc,
            name: this.props.BuyerName,
          }
        }

        var card = await stripe.createToken(information);
        console.log(card)
        var token = card.id;
        if('card' in card) {
          this.sendTokenToStripe(token);
        } else {
          console.log(Object.keys(card))
          console.log(card.error.code)
          alert(card.error.message, { cancelable: false })
          //this.sendTokenToStripe(token);
        }
        // this.setState({token})
        //await promisedSetState({token: token});
        // send token to backend for processing

      } 
      catch (error) {
        console.log(error);
      }
    }

    promisedSetState(newState) {
      console.log(newState);
      console.log('this is new state')
      return new Promise((resolve) => {
          this.setState(newState, () => {
              resolve()
          });
      });
    }
    

    sendTokenToStripe =(token) =>{
      console.log('stripe function called');
      console.log(token)
      this.makeLambdaCal(token)
      this.setState({token})
    }

    updateProductOnPayment(){

      console.log("Updating the order number");
      var orderNumberReference = firebase.firestore().collection('OrderNumber').doc('LI2DFIy1txzPZw7n7flV');
      var currentOrderNumber = 0;

      orderNumberReference.get().then((doc)=>{
          currentOrderNumber = doc.data().CON;
          var newOrderNumber = currentOrderNumber+1;
          var jobData={
            BuyerId:'',
            SellerId:'',
            DeliveryLocation: null ,
            DeliveryTimeSplots: null,
            OrderNumber: newOrderNumber,
            PickupTimeSplots: null,
          };

          //Creating the new job
          AddJob(jobData).then(()=>{
            orderNumberReference.update({CON:newOrderNumber});
            var productStatusReferenceTemp = firebase.firestore().collection('Products').doc(this.state.productID);
            productStatusReferenceTemp.update({OrderNumber: newOrderNumber});
            console.log('Job Successfully Posted');
            //change the order number state
            this.setState({orderNumber:newOrderNumber});


            const resetAction = StackActions.reset({
              index: 0, // <-- currect active route from actions array
              //params: {userId: this.state.UID},
              actions: [
                NavigationActions.navigate({ routeName: 'PaymentSuccessScreen', params: {responseMessage: this.state.responseMessage, navigation: this.props.navigation, productId:this.state.productID }} ),
              ],
            });
            this.props.navigation.dispatch(resetAction);

          })
      });
      console.log('updateProductOnPayment function called');
      var productStatusReference = firebase.firestore().collection('Products').doc(this.state.productID);
      return productStatusReference.update({
        Status: 'bought',
        BuyerID: this.state.userId,
        BuyerName: firebaseChat.userDisplayName,
        BuyerAddress: this.state.BuyerAddress,
        DeliveryFee: this.state.DeliveryFee,
        TotalFee:  Math.round(this.props.charge),
        BoughtStatus: 'true',
      })
    }

    postTransactionOnPayment(){
      console.log('postTransactionOnPaymen function called');
      var data = {
        ProductId: '',
        Price : this.state.price,
        DeliveryFee: this.state.DeliveryFee,
        TotalFee:  Math.round(this.props.charge),
        Commission:'',
        BuyerAddress: this.state.BuyerAddress,
        BuyerName: firebaseChat.userDisplayName,
        BuyerID: this.state.userId,
        SellerAddress: '',
        AddressArray: '',
        SellerName: '',
        Owner : '',
        TimeStamp: null,
        PaymentStatus:'',
        OrderNumber:'',
        StripeReference:'',
        DeliveryTracking:'',
        Notes:'',
        orderNumber:'99',
      }
  
      //Getting the current time stamp
      var currentDate = new Date();
      data.TimeStamp = currentDate.getTime();
      //if(this.checkFields == true)
      //Posting the product
      PostTransaction(data);
      console.log("Product Posted---->" + data);
    }

    //AWS lambda function call
    makeLambdaCal(token) {

      const { navigate } = this.props.navigation;

      try{
        this.state.loading =true;
        console.log('Loading state before ' + this.state.loading);

      fetch('https://7w745rxni6.execute-api.us-west-1.amazonaws.com/development', {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'x-api-key': 'oOA7d3dNR84mu2r4795DSaSWnuAvBZDkaVmtwEwJ',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          'stripeToken': token,
          'charge': Math.round(this.state.TotalCartAmount*100),
          'buyerName': this.props.BuyerName,
          'title': this.props.Title,
          'sellerAddress': this.props.SellerAddress,
          'email': this.props.Email,
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('response JSon ' + responseJson.body)
        //alert(responseJson.body)
        // this.state.loading = false; 
        this.state.responseJson = responseJson.body;

        if(this.state.responseJson == 'Payment Successfull'){
          this.setState({ loading: false });
          console.log('Loading state ' + this.state.loading);
          this.updateProductOnPayment();
          //this.postTransactionOnPayment();
          //this.showAlert();
          console.log("Trying to navigate");
          //navigate('PaymentSuccessScreen');
      

        }else{
          this.setState({ loading: false });
          console.log('Loading state ' + this.state.loading);
          // this.setState({ spinner: false });

          setTimeout(() => {
            Alert.alert('Oops!', this.state.responseJson);
          }, 100);
        }
      });

    }
    catch(error) {
      console.log(error)
    }
  }
    _onChange = (formData) => {
      //console.log(JSON.stringify(formData, null, " "))
      cardNumber = formData.values.number
      cardNumber = cardNumber.replace(/\s/g, '');
      expiryDate = formData.values.expiry;
      expiryDate = expiryDate.split('/');
      expiryMonth = expiryDate[0]
      expiryYear = expiryDate[1]
      cvc = formData.values.cvc

      if(formData.valid){
        //alert('Card is Valid')
        this.setState({valid:true})
        this.setState({card_number: cardNumber})
        this.setState({exp_month: expiryMonth})
        this.setState({exp_year: expiryYear})
        this.setState({cvc})
        //this.setState({card_number: cardNumber}, {exp_month: expiryMonth}, {exp_year: expiryYear}, {cvc})
        
      }
      // if()
    };

    render() {
      const EnabledButton = <Button primary onPress={this.onPayment}><Text style={{paddingLeft: 10, paddingRight: 10, color: '#fff'}}> Pay Now</Text></Button>
      const DisabledButton = <Button primary disabled onPress={this.onPayment} ><Text style={{paddingLeft: 10, paddingRight: 10}}>Pay Now</Text></Button>
      const {showAlert} = this.state;

      console.log('Product ID ==> ' + this.state.productID)

      return (
        <DismissKeyboard>
        <View style={styles.mainContainer}>
          <Spinner
            visible={this.state.loading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />

          <CreditCardInput onChange={this._onChange} />
          {/* <Button title="Stripe" onPress={this.onPayment}/> */}

            <View style = {styles.payButton}>
              {this.state.valid ? EnabledButton : EnabledButton}
            </View>

          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Thank You!"
            message={this.state.responseJson}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="OK"
            confirmButtonColor= {Colors.primary}
            onCancelPressed={() => {
              this.hideAlert();
            }}
            onConfirmPressed={() => {
              this.hideAlert();
            }}
          />

        </View>
        </DismissKeyboard>
      );
  }
}

const styles= {
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
    spinnerTextStyle: {
    color: '#0000FF'
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
  payButton: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingLeft: 10,
    paddingRight: 10,
  },

  payButtonText: {
    paddingLeft: 10, 
    paddingRight: 10, 
    color: '#fff'
  }
}