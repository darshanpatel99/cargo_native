import React, { Component } from 'react';
import {Platform, View, StyleSheet, ActivityIndicator, TouchableHighlight,TouchableWithoutFeedback,Keyboard, KeyboardAvoidingView, TextInput, Dimensions, Switch } from 'react-native';
import {Button,Text,Item,Container,Icon,} from 'native-base';
import Colors from '../../constants/Colors.js';
import firebase from '../../Firebase';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Header } from 'react-navigation-stack';
import Constants from 'expo-constants';
import NumericInput from 'react-native-numeric-input';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);


export default class Checkout extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const TotalCartAmount = parseFloat(navigation.getParam('TotalCartAmount'));
    const DeliveryCharge = parseFloat(navigation.getParam('DeliveryCharge'));
    const userId = navigation.getParam('userID');
    const sellerAddress = navigation.getParam('SellerAddress');
    const productTitle = navigation.getParam('Title');
    const GPSStringFormat = navigation.getParam('GPSLocation');
    const productID = navigation.getParam('productID');
    const deliveryVehicle = navigation.getParam('deliveryVehicle');
    const deliveryProvider = navigation.getParam('deliveryProvider');
    const sellerDeliveryPrice = navigation.getParam('sellerDeliveryPrice');

    this.state = {
      defaultAddress: '',
      deliveryAddress: defaultAddress,
      tipAmount:0,
      subTotal: TotalCartAmount,
      deliveryFee: DeliveryCharge,
      totalAmount:0,
      editDialogVisible: false,
      isLoading: false,
      tempAddressStore:'',
      userId,     
      buyerName: '',
      sellerAddress: sellerAddress,
      productTitle: productTitle,
      Email:'',
      GPSStringFormat: GPSStringFormat,
      productID: productID,
      showAlert: false,
      convenienceFee: (TotalCartAmount * 0.05 ).toFixed(2),
      switchValue:true,
      deliveryVehicle,
      deliveryProvider,
      sellerDeliveryPrice
    };



    this.toggleSwitch = this.toggleSwitch.bind(this)

    let {City, Street, Country, Buyer} ='';
    let defaultAddress='' ;
    //let amount = parseFloat(this.state.tipAmount) + parseFloat(this.state.deliveryFee) + parseFloat(this.state.subTotal) + parseFloat(this.state.convenienceFee);

    this.NavigateToPay = this.NavigateToPay.bind(this);    
    //amount = amount.toFixed(2)

    this.ref = firebase.firestore();

    this.collectionRef = this.ref
    .collection('Users')
    .doc(this.state.userId).get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
        Street = doc.data().Street;
        Country = doc.data().Country;
        City = doc.data().City;
        defaultAddress = Street + ', ' + Country + ', ' + City;
        Buyer = doc.data().FirstName;
        Email = doc.data().Email;
        this.setState({deliveryAddress: defaultAddress,
        //totalAmount: parseFloat(this.state.tipAmount) + parseFloat(this.state.deliveryFee) + parseFloat(this.state.subTotal) + parseFloat(this.state.convenienceFee),
        // totalAmount: amount,
        buyerName: Buyer,
        Email
        })
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
    this.unsubscribe = null;
  }

      //toggle switch this function is called upon delivery switch is turned on or off
    toggleSwitch() {
      if(this.state.switchValue == false) {
        //checking whos the delivery provider. True is sellerDelivery, false CarGo provides delivery
        let totalAmount;
        if(this.state.deliveryProvider == true) {
            totalAmount = parseFloat(this.state.sellerDeliveryPrice) + parseFloat(this.state.subTotal) + parseFloat(this.state.convenienceFee);
        } else {
            totalAmount = parseFloat(this.state.deliveryFee) + parseFloat(this.state.subTotal) + parseFloat(this.state.convenienceFee);
        }
        this.setState({totalAmount})
        this.setState({switchValue: true})
      }
      else {
        let totalAmount = parseFloat(this.state.subTotal) + parseFloat(this.state.convenienceFee);
        this.setState({totalAmount})       
        this.setState({switchValue: false})
      }
    }


  googleAddressCallback = (latitude, longitude) => {
    console.log('Product SellerAddress ' + this.state.sellerAddress )
    let addressArray = [latitude, longitude];
    console.log('This is address array' + addressArray)
    this.setState({
      addressArray
    })
    this._getLocationAsync();
  }
  _getLocationAsync (lat, long){
    //this.setState({ location });
    console.log('Inside get location async-----')
    let deliveryLat = lat;
    let deliveryLong = long;
    let productLocationLatitude = this.state.sellerAddress[0];
    let productLocationLongitude = this.state.sellerAddress[1];
    fetch('https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins='+deliveryLat+','+deliveryLong+'&destinations='+productLocationLatitude+'%2C'+productLocationLongitude+'&key=AIzaSyAIif9aCJcEjB14X6caHBBzB_MPSS6EbJE')
      .then((response) => response.json())
      .then((responseJson) => {
        //return responseJson.movies;
        const distanceInMeters = responseJson.rows[0].elements[0].distance.value;
        let deliveryCharge;
        if(distanceInMeters <= 5000) {
          deliveryCharge = 3.99;
        } else if(distanceInMeters >= 5000 && distanceInMeters <= 10000){
          deliveryCharge = 3.99;
        } else if (deliveryCharge >= 10000 && deliveryCharge <= 17000){
          deliveryCharge = 3.99;
        } else {
          deliveryCharge = 3.99;
        }
        console.log('THIS is delivery charge checkout screen -- ' + deliveryCharge)
        //deliveryCharge = deliveryCharge.toFixed(2);
        this.setState({
          deliveryFee: deliveryCharge,
          totalAmount: (parseFloat(this.state.tipAmount) + parseFloat(this.state.deliveryFee) + parseFloat(this.state.subTotal) + parseFloat(this.state.convenienceFee)).toFixed(2),
        })
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  componentWillMount(){
    const { navigation } = this.props;
    let deliveryCharge;
    if(this.state.deliveryProvider) {
      deliveryCharge= this.state.sellerDeliveryPrice
    } else {
      deliveryCharge= this.state.deliveryFee
    }
    let amount = (parseFloat(deliveryCharge) + parseFloat(this.state.subTotal) + parseFloat(this.state.convenienceFee)).toFixed(2);
    //amount = amount.toFixed(2)
    // Here Im calculating the height of the header and statusbar to set vertical ofset for keyboardavoidingview
    const headerAndStatusBarHeight = Header.HEIGHT + Constants.statusBarHeight;
    console.log('Header and Status Bar --> ' + headerAndStatusBarHeight);
    KEYBOARD_VERTICAL_OFFSET_HEIGHT =
      Platform.OS === 'ios'
        ? headerAndStatusBarHeight - 500
        : headerAndStatusBarHeight;
    
    this.focusListener = navigation.addListener('didFocus', () => { 
      this.setState({
        totalAmount: amount,
      })
    }); 
  }

  componentWillUnmount() {
    // Clean up: remove the listener
    //this._unsubscribe();
    this.focusListener.remove();
  }
 
  afterSetStateFinished(){
    let deliveryCharge;
    if(this.state.sellerAddress) {
      deliveryCharge= this.state.sellerAddress
    } else {
      deliveryCharge= this.state.deliveryFee
    }
    this.setState({ totalAmount: (parseFloat(deliveryCharge) + parseFloat(this.state.subTotal) + parseFloat(this.state.convenienceFee)).toFixed(2) });

  }

  componentDidMount(props) {
    //this.unsubscribe = this.ref.onSnapshot(this.onDocumentUpdate);
    this.unsubscribe = this.collectionRef;
  }

  showAlert(){
    this.setState({
      showAlert: true
    });
  };

  hideAlert(){
    const { navigate } = this.props.navigation;
    this.setState({
      showAlert: false
    });
  };

  NavigateToPay(){
    const { navigate } = this.props.navigation;
    if(this.state.switchValue) {
      if(this.state.GPSStringFormat != ''){
      navigate('StripeScreen', {deliveryFee:this.state.deliveryFee,  GPSStringFormat:this.state.GPSStringFormat, Email: this.state.Email, TotalCartAmount:this.state.totalAmount, BuyerName: this.state.buyerName, Title: this.state.productTitle, sellerAddress: this.state.sellerAddress, Email: this.state.Email, productID:this.state.productID, userId:this.state.userId})
    } else{
      this.showAlert();
    }
  } else {
      navigate('StripeScreen', {deliveryFee:this.state.deliveryFee,  GPSStringFormat:this.state.GPSStringFormat, Email: this.state.Email, TotalCartAmount:this.state.totalAmount, BuyerName: this.state.buyerName, Title: this.state.productTitle, sellerAddress: this.state.sellerAddress, Email: this.state.Email, productID:this.state.productID, userId:this.state.userId})

  }

  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerRight: (
        <TouchableHighlight
        onPress={() => navigation.navigate('Account')}
          style={{ marginRight: 10 }}
        >
          <Icon
                style={{ fontSize: 45, marginRight: 5 }}
                type='EvilIcons'
                name='user'
              />
        </TouchableHighlight>
      )
    };
  };


  //this function will render delivery address component if delivery is needed
  askForDeliveryAddress() {

    if(this.state.switchValue)
      return(  
        <View style = {{marginTop: 50, marginBottom: 50}}>
        <Text>
          Delivery Address
        </Text>
        <TextInput
          placeholder= 'Please input delivery address here'
          underlineColorAndroid="transparent"
          autoCapitalize='none'
          autoCorrect={false}
          style={Styles.deliveryAddressStyle}
          onChangeText = {text => this.setState({GPSStringFormat: text})}
        />
        </View>
      );
      else {
        console.log('delivery not needed')
        return(
          <View style ={{margin: 5}}>
          <Text>Note: </Text>
          <Text>Please coordinate with seller to arrange pickup</Text>
          <Text>Seller contact information will revel upon successful transaction</Text>
          </View>
        )
      }
  }

  //add delivery charge
  addDeliveryCharge() {
    let deliveryChargeText;
    if(this.state.deliveryProvider) {
    deliveryChargeText = this.state.sellerDeliveryPrice
    } else {
    deliveryChargeText = this.state.deliveryFee
    }
    if(this.state.switchValue) {
    return (
        <Text>Delivery Fee: $ {deliveryChargeText}</Text>
      );
    } else {
        <Text>Delivery Fee: ${deliveryChargeText}</Text>
      console.log('delivery not needed');    
    }
  }

  render() {
    const {showAlert} = this.state;
    console.log('Product ID ==> ' + this.state.productID)
    if (this.state.isLoading) {
      return (
        <View style={Styles.activity}>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      );
    }
    return (
      <DismissKeyboard>
      <View style={Styles.Container}>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // behavior='padding'
        // keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET_HEIGHT}
        >

        <Container>


        <KeyboardAvoidingView
        //style={{ flex: 1 }}
        behavior='padding'
        keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET_HEIGHT}

        >

        <View style={Styles.textContainer}>
          <View style={Styles.leftContainer}>
          <Text> Do you need delivery ? </Text>
          </View>

          <View style={Styles.rightContainer}>
            <Switch
              onValueChange = {this.toggleSwitch}
              value = {this.state.switchValue}/>
          </View>

        </View>
            {this.askForDeliveryAddress()}
            <View style={Styles.AddressFunctionButtonView}>

            {/* <Text
              style={{
                marginLeft: 15,
                marginTop: 50,
                fontSize: 20,
                fontFamily: 'nunito-SemiBold'
              }}
            >
              Tip $ :
            </Text>
            <Item style={{marginLeft:10 ,marginTop: 50,}}>

            <NumericInput 
              value={this.state.tipAmount} 
              onChange={value => this.setState({tipAmount:value }, () => {
                this.afterSetStateFinished();
            })}
              onLimitReached={(isMax,msg) => console.log(isMax,msg)}
              totalWidth={140} 
              totalHeight={40} 
              iconSize={25}
              step={1}
              minValue={0}
              maxValue={99}
              valueType='integer'
              rounded 
              textColor='#000000' 
              iconStyle={{ color: 'white' }} 
              rightButtonBackgroundColor='#0000cc' 
              leftButtonBackgroundColor='#0080ff'/>

            </Item> */}
          </View>
          
          </KeyboardAvoidingView>
          <Text
            style={{
              marginLeft: 15,
              marginRight: 15,
              marginTop: 20,
              fontSize: 20,
              fontFamily: 'nunito-SemiBold'
            }}
          >
            Items Total
          </Text>
          <View style={Styles.priceCard}>
            <Text>Subtotal: ${this.state.subTotal}</Text>
            {/* <Text>Tip: ${this.state.tipAmount}</Text> */}
            {this.addDeliveryCharge()}
            <Text>Convenience Fee (5%): ${this.state.convenienceFee}</Text>
            <Text>Total Amount: ${this.state.totalAmount} </Text>
          </View>
          <View style={Styles.payButton}>
            <Button large-green style= {{flex:1, justifyContent: 'center'}} onPress={this.NavigateToPay}>
              <Text style={{justifyContent: 'center',fontSize: 20,
              fontFamily: 'nunito-SemiBold'}}>Pay</Text>
            </Button>

          </View>
        </Container>

        <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="   Alert   "
            message="Please input your address!"
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="  OK  "
            confirmButtonColor={Colors.primary}
            onCancelPressed={() => {
              this.hideAlert();
            }}
            onConfirmPressed={() => {
              this.hideAlert();
            }}
        />

      </KeyboardAvoidingView>
      </View>
      </DismissKeyboard>
    );
  }
}
const Styles = {
  Container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    marginLeft: 10,
    marginEnd: 10,
    padding: 5
  },
  AddressFunctionButtonView: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    // alignContent: 'stretch',
    marginRight: 15
  },
  DeliveryButtons: {
    flex: 0,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignContent: 'stretch'
  },
  subTotalText: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  priceCard: {
    // flex:0,
    // justifyContent: 'flex-start',
    // flexDirection: 'row',
    margin: 10,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#FDFCF5',
    shadowColor: 'grey',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 0
    },
    fontSize: 20
  },
  TextInputStyle: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    //textAlign: "center",
    alignItems: "center",
    height: 40,
    //width: 100,
    borderRadius: 5,
    margin: 10,
    padding:10,
    backgroundColor: "#f8f8f8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
  },
  payButton: {
    // marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    textAlign: "center",
  },
    textContainer:{
    flexDirection: 'row',
    height: 30,
  },
  leftContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
  },
  rightContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  deliveryAddressStyle: {
    marginTop: 20,
    alignSelf: 'stretch',
    borderBottomColor:'#000',
    marginRight:50,
    borderBottomColor: '#000', // Add this to specify bottom border color
    borderBottomWidth: 2     // Add this to specify bottom border thickness
  }
}

