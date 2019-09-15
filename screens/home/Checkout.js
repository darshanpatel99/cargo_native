import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableHighlight,TouchableWithoutFeedback,Keyboard } from 'react-native';
import {Button,Text,Item,Input,Container,Icon,} from 'native-base';
import Colors from '../../constants/Colors.js';
import firebase from '../../Firebase';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AwesomeAlert from 'react-native-awesome-alerts';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);


export default class Checkout extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const TotalCartAmount = parseFloat(navigation.getParam('TotalCartAmount')) ;
    const DeliveryCharge = parseFloat(navigation.getParam('DeliveryCharge'));
    const userId = navigation.getParam('userID');
    const sellerAddress = navigation.getParam('SellerAddress');
    const productTitle = navigation.getParam('Title');
    const GPSStringFormat = navigation.getParam('GPSLocation')
    const productID = navigation.getParam('productID')
    this.state = {
      defaultAddress: '',
      deliveryAddress: defaultAddress,
      tipAmount: 0,
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
    };
    let {City, Street, Country, Buyer} ='';
    let defaultAddress='' ;
    let amount = this.state.tipAmount+this.state.deliveryFee + this.state.subTotal;

    this.NavigateToPay = this.NavigateToPay.bind(this);    
    amount = amount.toFixed(2)
    let address = firebase
    .firestore()
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
        totalAmount: this.state.tipAmount+this.state.deliveryFee + this.state.subTotal,
        // totalAmount: amount,
        buyerName: Buyer,
        Email
        })
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
  
    //this.unsubscribe = null;

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
        console.log(productLocationLatitude);
        console.log(productLocationLongitude)
        console.log('&&&&&&&&&&&&&&&&&')
        console.log(responseJson.rows[0].elements[0].distance.value);

        const distanceInMeters = responseJson.rows[0].elements[0].distance.value;
        let deliveryCharge;
        if(distanceInMeters <= 5000) {
          deliveryCharge = 3.99;
        } else if(distanceInMeters >= 5000 && distanceInMeters <= 10000){
          deliveryCharge = 6.99;
        } else if (deliveryCharge >= 10000 && deliveryCharge <= 17000){
          deliveryCharge = 9.99;
        } else {
          deliveryCharge = 14.99;
        }
        console.log('THIS is delivery charge checkout screen -- ' + deliveryCharge)
        //deliveryCharge = deliveryCharge.toFixed(2);
        this.setState({
          deliveryFee: deliveryCharge,
          totalAmount: (deliveryCharge+this.state.subTotal).toFixed(2)
        })
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  componentWillMount(){
    const { navigation } = this.props;
    let amount = this.state.tipAmount+this.state.deliveryFee + this.state.subTotal;
    amount = amount.toFixed(2)
    
    this.focusListener = navigation.addListener('didFocus', () => { 
      this.setState({
        totalAmount: amount,
      })
    }); 

  }


  componentDidMount(props) {
    //this.unsubscribe = this.ref.onSnapshot(this.onDocumentUpdate);
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
    if(this.state.GPSStringFormat != ''){
      console.log('Inside if =>>>>>>>>>')
      navigate('StripeScreen', {deliveryFee:this.state.deliveryFee,  GPSStringFormat:this.state.GPSStringFormat, Email: this.state.Email, TotalCartAmount:this.state.totalAmount, BuyerName: this.state.buyerName, Title: this.state.productTitle, sellerAddress: this.state.sellerAddress, Email: this.state.Email, productID:this.state.productID, userId:this.state.userId})
    }
    else{
      console.log('Inside else =>>>>>>>>>')
      this.showAlert();
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

        <Container>

          <Text
            style={{
              marginLeft: 15,
              marginTop: 20,
              fontSize: 30,
              fontFamily: 'nunito-SemiBold'
            }}
          >
            Update Delivery Address
          </Text>
    
    <GooglePlacesAutocomplete
                ref={c => this.googlePlacesAutocomplete = c}
                placeholder='Pickup Address'
                minLength={2}
                autoFocus={false}
                returnKeyType={'default'}
                fetchDetails={true}
                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed='false'    // true/false/undefined
                renderDescription={row => row.description} // custom description render
                
                // textInputProps={{
                //   onChangeText: (text) => {this.testFunction(text)}
                //  }}
                onPress={(data, details = null) => {
                
                
                console.log(Object.values(details.geometry.location))
                let lat = Object.values(details.geometry.location)[0];
                let long = Object.values(details.geometry.location)[1];
                this.setState({addressArray: [lat, long]})
                this.setState({GPSStringFormat: (Object.values(details.geometry.location))});
                this._getLocationAsync(lat, long)
                //this.props.parentCallback(this.state.lat, this.state.long);
                //console.log('LAT --> ' + Object.values(details.geometry.location)[0])
                }}
                GoogleReverseGeocodingQuery={{
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                }}

                getDefaultValue={() => {
                    return this.state.GPSStringFormat; // text input default value
                }}

                query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: 'AIzaSyAIif9aCJcEjB14X6caHBBzB_MPSS6EbJE',
                    language: 'en', // language of the results
                    types: 'geocode', // default: 'geocode'
                }}

                styles={{
                  textInputContainer: {
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderTopWidth: 0,
                  borderBottomWidth:0
                  },
                  textInput: {
                  height: 38,
                  color: '#5d5d5d',
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor:'blue',
                  marginLeft: 0,
                  marginRight: 0,
                  },
                  predefinedPlacesDescription: {
                  color: '#1faadb'
                  },
              }}
                currentLocation={false}vi
                />


          <View style={Styles.AddressFunctionButtonView}>
            <Text
              style={{
                marginLeft: 15,
                // marginTop: 20,
                fontSize: 20,
                fontFamily: 'nunito-SemiBold'
              }}
            >
              Tip %:
            </Text>
            <Item style={{ marginRight: 15 }}>
              <Input
                keyboardType='numeric'
                value={this.state.tipAmount}
                onChangeText={value => { if(value){
                  this.setState({ tipAmount: parseFloat(value), totalAmount: (parseFloat(value)+this.state.deliveryFee + this.state.subTotal).toFixed(2) });
                  console.log(this.state.tipAmount);
                }else{
                  this.setState({ tipAmount: 0, totalAmount: 0+this.state.deliveryFee + this.state.subTotal });
                }
                }}
                placeholder='Enter Tip amound in CAD'
              />
              <Icon type='Feather' name='percent' />
            </Item>
          </View>
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
            <Text>Tip: ${this.state.tipAmount}</Text>
            <Text>Delivery Fee: ${this.state.deliveryFee}</Text>
            <Text>Total Amount: ${this.state.totalAmount} </Text>
          </View>
          <View style={Styles.payButton}>
            <Button large-green style= {{flex:1, justifyContent: 'center'}} onPress={this.NavigateToPay}>
              <Text style={{justifyContent: 'center'}}>Pay</Text>
            </Button>

          </View>
        </Container>

        <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="   Alert   "
            message="Please update your address!"
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
      </View>
      </DismissKeyboard>
    );
  }
}
const Styles = StyleSheet.create({
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
    justifyContent: 'space-between',
    alignContent: 'stretch',
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
  payButton: {
    // marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    textAlign: "center",
  }
});