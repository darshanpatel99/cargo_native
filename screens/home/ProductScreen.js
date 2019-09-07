import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Button,
  TouchableHighlight,
  Dimensions,
  Platform
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { FontAwesome, Ionicons, AntDesign } from '@expo/vector-icons';
import Colors from '../../constants/Colors.js';
import firebase from '../../Firebase.js';
import { SliderBox } from 'react-native-image-slider-box';
import { TouchableOpacity } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';
import ReportAd from '../../functions/ReportAd';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MainButton from '../../components/theme/MainButton'; //components\theme\MainButton.js

import AwesomeAlert from 'react-native-awesome-alerts';


let storageRef;
export class ProductScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;

    const title = navigation.getParam('title');
    const description = navigation.getParam('description');
    const price = navigation.getParam('price');
    const pictures = navigation.getParam('pictures');
    const id = navigation.getParam('itemId');
    const owner = navigation.getParam('owner');
    const pickupAddress = navigation.getParam('pickupAddress')

    //storageRef = firebase.storage().ref();





    this.state = {
      location: null,
      errorMessage: null,
      deliveryCharge:'',
      showAlert: false,
      User: null,
      pictures: [],
      cart: [],
      address: {},
      title,
      count: 0,
      description,
      pictures,
      price,
      id,
      owner,
      userID:'',
      itemAlreadyInCart: false,
      buttonTitle: 'Add to Cart',
      soldArray:[],
      pickupAddress: pickupAddress,
    };
    onLayout = e => {
      this.setState({
        width: e.nativeEvent.layout.width
      });
    };

    this.NavigateToCheckout = this.NavigateToCheckout.bind(this);
    this.NavigateToMessage = this.NavigateToMessage.bind(this);
    this.NavigateToEdit = this.NavigateToEdit.bind(this);
    this.CheckIfProductAlreadyInCart = this.CheckIfProductAlreadyInCart.bind(this);
    this.flagTheItem = this.flagTheItem.bind(this);

    //checking the current user and setting uid
    let user = firebase.auth().currentUser;

    

    if (user != null) {
      const that = this;
      this.state.userID = user.uid;
      this.ref = firebase.firestore().collection('Users').doc(this.state.userID);
      this.ref.get().then(function(doc) {
        if (doc.exists) {
            that.setState({
              soldArray:doc.data().SoldProducts,
            })
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    
    
    }



  }


  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    let currentDeviceLatitude = this.state.location.coords.latitude;
    let currentDeviceLongitude = this.state.location.coords.longitude;

    let productLocationLatitude = this.state.pickupAddress[0];
    let productLocationLongitude = this.state.pickupAddress[1];

    

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
        //deliveryCharge = deliveryCharge.toFixed(2);
        this.setState({
          deliveryCharge: deliveryCharge
        })

      })
      .catch((error) => {
        console.error(error);
      });
  };


  componentDidMount() {
    // List to the authentication state
    this._unsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }
  
  componentWillUnmount() {
    // Clean up: remove the listener
    this._unsubscribe();
  }

  onAuthStateChanged = user => {
    // if the user logs in or out, this will be called and the state will update.
    // This value can also be accessed via: firebase.auth().currentUser
    this.setState({ User: user });
  };
 

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
    navigate('Account');
  };
 

  getData =()=>{
//     var docRef = db.collection("cities").doc("SF");

// docRef.get().then(function(doc) {
//     if (doc.exists) {
//         console.log("Document data:", doc.data());
//     } else {
//         // doc.data() will be undefined in this case
//         console.log("No such document!");
//     }
// }).catch(function(error) {
//     console.log("Error getting document:", error);
// });
  }

  NavigateToCheckout() {

    if(this.state.User != null){
      const { navigate } = this.props.navigation;
      //this.props.navigation.dispatch(StackActions.popToTop());
      navigate('Checkoutscreen', {userID:this.state.userID ,TotalCartAmount:this.state.price, DeliveryCharge: this.state.deliveryCharge, Title: this.state.title, SellerAddress: this.state.pickupAddress})
    }
    else{
      this.setState({
        showAlert: true
      });
    }
  };

  NavigateToMessage() {
    const { navigate } = this.props.navigation;
    //this.props.navigation.dispatch(StackActions.popToTop());
    navigate('Chat', {userID:this.state.userID})
  };

  NavigateToEdit(){
    const { navigate } = this.props.navigation;
    //this.props.navigation.dispatch(StackActions.popToTop());
    //navigate('EditProduct');

    const data = {
      title:this.state.title,
      price:this.state.price,
      pictures:this.state.pictures,
      description:this.state.description,
      id:this.state.id,
    }
    this.resetStack(data);
  };

  resetStack = (data) => {
    this.props
      .navigation
      .dispatch(StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({

            
            routeName: 'EditProduct',
            params: { data: data },
          }),
        ],
      }))
   }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      headerRight: (
        <TouchableHighlight
          onPress={ () => navigation.navigate('Chat')}
          style={{ marginRight: 10 }}
        >
          <AntDesign name='message1' size={30} color={Colors.primary} />
        </TouchableHighlight>
      )
    };
  };

  flagTheItem(){
    var documentID = uuid.v1();

    //this.storageRef.collection("FlaggedItems").doc(flaggedITems).set({productId: this.state.id});
    var data = {
      ProductId : this.state.id,
    }
    ReportAd(data);
    alert('Ad was reported, Thanks for your feedback!')
  }


  CheckIfProductAlreadyInCart() {

    
    if (this.state.owner != '' && this.state.owner === this.state.userID && this.state.deliveryCharge != '' ) {

      return (
        <View style ={{flexDirection:'row',justifyContent:'space-evenly'}}>

          <TouchableOpacity onPress={this.NavigateToEdit}>
                <MainButton title='Edit product' secondary="true" />
          </TouchableOpacity>

          <TouchableOpacity onPress={this.sooldItem}>
                <MainButton title='Mark sold' secondary="true" />
          </TouchableOpacity>
        </View>
          
      );
    } else {
        if (this.state.deliveryCharge != '' ) {
        return (
          <View style ={{flexDirection:'row',justifyContent:'space-evenly'}}>
            <TouchableOpacity onPress={this.NavigateToCheckout}>
              <MainButton title='Buy Now' bluesecondary="true"/>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.NavigateToMessage}>
              <MainButton title='Chat Now' bluesecondary="true"/>
            </TouchableOpacity>

          </View>
        );
      }
      else {
        return (
        <View style ={{flexDirection:'row',justifyContent:'space-evenly'}}>
          <TouchableOpacity>
            <MainButton title='Buy Now' bluesecondary="true"/>
          </TouchableOpacity>

          <TouchableOpacity>
            <MainButton title='Chat Now' bluesecondary="true"/>
          </TouchableOpacity>

        </View>
        );
      }
    }
  }

  sooldItem =() =>{
    console.log(this.state.soldArray);
    var tempArray = [...this.state.soldArray];
    tempArray.push(this.state.id)

    this.ref.update({
      SoldProducts:tempArray,
      
    })  
    var updateProduct = firebase.firestore().collection('Products').doc(this.state.id);

    updateProduct.update({
      Status:'sold',
    })
  }

  render() {
    console.log('getting product id as props ======> ' + this.state.id);
    const {showAlert} = this.state;

    return (
    
    <View style={styles.container}>
        <ScrollView>

        <View style={styles.pictures}>
          <SliderBox
            images={this.state.pictures}
            sliderBoxHeight={400}
            // onCurrentImagePressed={index =>
            //   console.warn(`image ${index} pressed`)
            // }
            dotColor='#FFEE58'
            inactiveDotColor='#90A4AE'
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 15,
              marginHorizontal: 10,
              padding: 0,
              margin: 0
            }}
            parentWidth={this.state.width}
          />
        </View>

        {/* <View style={styles.infotext}> */}
          <View style={styles.nameAndPrice}>
            <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">{this.state.title}</Text>
            <Text style={styles.productPrice} numberOfLines={2} ellipsizeMode="tail">$ {this.state.price}</Text>
          </View>

          {/* <Text>Local number => {this.state.count} </Text>
         <Text>Total product in firebase => {this.state.cart.length}</Text> */}
          <View style={styles.LocViewAndPrice}>
            <View style={styles.priceDr}>
              <Text style={styles.price}>$ {this.state.deliveryCharge}</Text>
              <FontAwesome name='car' size={22} color={Colors.primary} />
            </View>
          </View>

        
          <Text style={styles.productDesc}>{this.state.description}</Text>
        {/* </View> */}

        </ScrollView>
         <View >
           <TouchableOpacity onPress={this.flagTheItem}>
           <Text style={styles.reportAd}> Report Ad </Text>
           </TouchableOpacity>
         </View>

        <View style={styles.BottomPart}>
          {this.CheckIfProductAlreadyInCart()}
        </View>

        <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="   Alert   "
            message="Please login first!"
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="Go to login!!"
            confirmButtonColor={Colors.primary}
            onCancelPressed={() => {
              this.hideAlert();
            }}
            onConfirmPressed={() => {
              this.hideAlert();
            }}
        />

      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    //paddingTop: 20,
    backgroundColor: '#fff',
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
  breaks: {
    width: Dimensions.get('window').width * 0.05
  },
  images: {
    height: Dimensions.get('window').height * 0.48,
    width: Dimensions.get('window').width * 0.9
  },
  pictures: {},

  infotext: {
    flex: 2.5,
    paddingLeft: 8,
    paddingRight: 5
  },
  productName: {
    fontSize: 25,
    fontWeight: 'bold',
    alignItems: 'flex-start',
    margin:10,
    flexWrap: 'wrap',
  },
  productPrice: {
    fontSize: 25,
    fontWeight: 'bold',
    marginHorizontal:10,
    margin: 10,
    flexWrap: 'wrap'
  },
  nameAndPrice: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productLocView: {
    flexDirection: 'row',
    flex: 0.9,
    alignItems: 'flex-start',
  },
  productLoc: {
    fontSize: 18,
    fontWeight: '500',
    paddingLeft: 7,
    
  },
  productDesc: {
    fontSize: 15,
    fontWeight: '100',
    paddingLeft: 7,
    marginTop:10,
    marginLeft: 10,
    marginRight: 10 
  },
  price: {
    fontSize: 18,
    fontWeight: '500',
  },
  priceDr: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 7,
  },
  LocViewAndPrice: {
    flexDirection: 'row',
    marginTop: 5
  },
  BottomPart: {
    marginBottom: 25,
    alignItems: 'center',
  },
  purchaseButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgb(57, 124,255)'
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '800',

  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  removeFromCartButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  reportAd: {
    color: Colors.primary,
    alignSelf: 'flex-end',
  }
});
