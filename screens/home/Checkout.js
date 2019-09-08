import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableHighlight } from 'react-native';
import {
  Button,
  Header,
  Text,
  Body,
  Left,
  List,
  ListItem,
  Right,
  Item,
  Input,
  Container,
  Icon,
  Content
} from 'native-base';

import firebase from '../../Firebase';
import GooglePickupAddress from '../../components/maps/GooglePickupAddress'


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

    this.state = {
      defaultAddress: '',
      deliveryAddress: defaultAddress,
      tipAmount: 0,
      subTotal: TotalCartAmount,
      deliveryFee: DeliveryCharge,
      totalAmount: 0,
      editDialogVisible: false,
      isLoading: false,
      tempAddressStore:'',
      userId,
      buyerName: '',
      sellerAddress: sellerAddress,
      productTitle: productTitle,
      Email:'',
      GPSStringFormat: GPSStringFormat
    };

    let {City, Street, Country, Buyer} ='';
    let defaultAddress='' ;
    let amount = this.state.tipAmount+this.state.deliveryFee + this.state.subTotal;
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
        //totalAmount: this.state.tipAmount+this.state.deliveryFee + this.state.subTotal,
        totalAmount: amount,
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

  _getLocationAsync (){


    //this.setState({ location });
    let currentDeviceLatitude = this.state.addressArray[0];
    let currentDeviceLongitude = this.state.addressArray[1];

    let productLocationLatitude = this.state.sellerAddress[0];
    let productLocationLongitude = this.state.sellerAddress[1];


    fetch('https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins='+currentDeviceLatitude+','+currentDeviceLongitude+'&destinations='+productLocationLatitude+'%2C'+productLocationLongitude+'&key=AIzaSyAIif9aCJcEjB14X6caHBBzB_MPSS6EbJE')
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
          deliveryFee: deliveryCharge
        })

      })
      .catch((error) => {
        console.error(error);
      });
  };



  componentDidMount(props) {
    //this.unsubscribe = this.ref.onSnapshot(this.onDocumentUpdate);
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

  NavigateToStripe() {
    const { navigate } = this.props.navigation;
    //this.props.navigation.dispatch(StackActions.popToTop());
    navigate('StripeScreen', {TotalCartAmount:this.state.totalAmount})
  };



  

  render() {
    if (this.state.isLoading) {
      return (
        <View style={Styles.activity}>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      );
    }
    return (
      <View style={Styles.Container}>
        {/* <Header transparent>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon
                style={{ fontSize: 40, marginLeft: 10 }}
                name='arrow-back'
              />
            </Button>
          </Left>
          <Right>
            <Button transparent onPress={() => this.props.navigation.push('Account')}>
              <Icon
                style={{ fontSize: 45, marginRight: 5 }}
                type='EvilIcons'
                name='user'
              />
            </Button>
          </Right>
        </Header> */}

        <Container>
          {/* <Text
            style={{
              marginLeft: 15,
              marginTop: 15,
              fontSize: 35,
              fontFamily: 'nunito-Bold'
            }}
          >
            Checkout
          </Text> */}
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

          {/* <List
            style={{
              marginLeft: 15,
              marginTop: 10,
              marginRight: 15,
              fontSize: 20,
              fontFamily: 'nunito-SemiBold'
            }}
          >
            <ListItem avatar>
              <Left>
                <Icon style={{ color: 'red' }} name='map-pin' type='Feather' />
              </Left>
              <Body>
                <Text>Home 1</Text>
                <Text note>{this.state.deliveryAddress}</Text>
              </Body>
              <Right>
                <Text style={{ color: 'green' }} note>
                  Selected
                </Text>
              </Right>
            </ListItem>
          </List> */}

          {/* <View style={Styles.AddressFunctionButtonView}>
            <Button
              title='Show Dialog'
              onPress={() => {
                this.setState({ editDialogVisible: true });
              }}
              style={{ marginLeft: 15, marginTop: 10, marginRight: 5 }}
            >
              <Text>Update Address</Text>
            </Button>

            <Dialog
              visible={this.state.editDialogVisible}
              dialogTitle={<DialogTitle title='Update Address' />}
              onTouchOutside={() => {
                this.setState({ editDialogVisible: false });
              }}
              rounded
              actionsBordered
              dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
              onHardwareBackPress={() => {
                console.log('onHardwareBackPress');
                this.setState({ editDialogVisible: false });
                return true;
              }}
              dialogStyle={{width: 290}}
              footer={
                <DialogFooter>
                  <DialogButton
                    text='Dismiss'
                    onPress={() => {
                      this.setState({ editDialogVisible: false });
                    }}
                  />
                  <DialogButton text='OK' onPress={() => this.setState({deliveryAddress: this.state.tempAddressStore, editDialogVisible: false})} />
                </DialogFooter>
              }
            >
              <DialogContent style={{height:100}}>
                <Input placeholder='Enter address here' onChangeText={(value) => this.setState({tempAddressStore: value})}/>
              </DialogContent>
            </Dialog>

            <Button
              style={{
                marginLeft: 15,
                marginRight: 15,
                marginTop: 10,
                marginRight: 5
              }}
            >
              <Text>Delete</Text>
            </Button>
          </View> */}

<GooglePickupAddress previousGPSAddress = {this.state.GPSStringFormat} parentCallback = {this.googleAddressCallback} ref={this.addressRemover}/>


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
                  this.setState({ tipAmount: parseInt(value), totalAmount: parseInt(value)+this.state.deliveryFee + this.state.subTotal });
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
            <Text>Total Amount: ${this.state.totalAmount}</Text>
          </View>

          <View style={Styles.payButton}>
            <Button large-green style= {{flex:1, justifyContent: 'center'}} onPress={ () => this.props.navigation.navigate('StripeScreen', {Email: this.state.Email, TotalCartAmount:this.state.totalAmount, BuyerName: this.state.buyerName, Title: this.state.productTitle, sellerAddress: this.state.sellerAddress, Email: this.state.Email  })}>
              <Text style={{justifyContent: 'center'}}>Pay</Text>
            </Button>
          </View>
        </Container>
      </View>
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
