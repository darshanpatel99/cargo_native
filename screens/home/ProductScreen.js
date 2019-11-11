import React, { Component } from 'react';
import { ScrollView, StyleSheet,  View,  TouchableHighlight,  TouchableOpacity,  Dimensions,  Platform,  Alert,  Text,  Share} from 'react-native';
import { Button} from "native-base";
import { StackActions, NavigationActions } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../constants/Colors.js';
import firebase from '../../Firebase.js';
import { SliderBox } from 'react-native-image-slider-box';
import uuid from 'react-native-uuid';
import ReportAd from '../../functions/ReportAd';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';

let storageRef;
export class ProductScreen extends Component {
  constructor(props) {

    super(props);
    const { navigation } = this.props;

    console.log('$$$$$$$$');
    const productObject= navigation.getParam('completeProductObject')

    const title = productObject.Name;
    const description = productObject.Description;
    const price = productObject.Price;
    const pictures = productObject.Pictures;
    const id = productObject.key; //document id
    const owner = productObject.Description;
    const pickupAddress = productObject.Description;
    const BuyerID = productObject.Owner;
    const Status = productObject.Status;
    const sellerName = productObject.SellerName;
    const BoughtStatus = productObject.BoughtStatus;
    const Category = productObject.Category;
    const deliveryVehicle = productObject.DeliveryVehicle;
    const deliveryProvider = productObject.DeliveryProvider;
    const sellerDeliveryPrice = productObject.SellerDeliveryPrice;
    const thumbnail = productObject.Thumbnail;
    const prevPage = navigation.getParam('prevPage');

    this.state = {
      location: null,
      errorMessage: null,
      deliveryCharge: 3.99,
      showAlert: false,
      User: null,
      pictures: [],
      cart: [],
      address: {},
      title,
      count: 0,
      description,
      pictures,
      thumbnail : thumbnail,
      price,
      id,
      owner,
      userID:'',
      Category,
      itemAlreadyInCart: false,
      buttonTitle: 'Add to Cart',
      soldArray:[],
      pickupAddress: pickupAddress,
      currentGpsLocationStringFormat: '',
      BuyerID,
      Status,
      sellerName,
      BoughtStatus,
      prevPage,
      completeChatThread: {'chat' : sellerName},
      sellerDeliveryPrice,
      deliveryProvider,
      deliveryVehicle
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
    this.CancelOrder = this.CancelOrder.bind(this);
    this.ReactivateOrder = this.ReactivateOrder.bind(this);
    this.shareAsync = this.shareAsync.bind(this);

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

    this.CheckIfProductAlreadyInCart();

    const { navigation } = this.props;
    
    this.focusListener = navigation.addListener('didFocus', () => { 
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
    });

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } 
    // else {
    //   this._getLocationAsync();
    // }
  }


  /**
   * Function Desription: Generate a sharable link
   */
  getSharableLink= async (productID)=>{

    var sharable_link = `https://cargodev.page.link/?link=https://cargodev.page.link/?product=${productID}&apn=com.developer.cargodev&afl=https://play.google.com/store/apps/details?id=com.developer.cargo&ibi=com.developer.cargo-dev&ifl=https://apps.apple.com/us/app/cargo-marketplace/id1477725337?ls=1`
    //have a post reques to firebase dynamic links to get the short link
    // fetch('https://firebasedynamiclinks.googleapis.com/v1/shortLinks', {
    //     method: 'POST',
    //     headers: {
    //       Accept: '*/*',
    //       'key': 'AIzaSyBrySojH8TyaXm-a5SF7Ij6PgyeL4Ry2bw',
    //       'Content-Type': 'application/json',
    //     },
    //     body:JSON.stringify({
    //       "longDynamicLink":sharable_link
    //     }),
    //   }).then((response)=>{
    //       console.log(response);

    //     }).catch((error)=>{
    //       console.log('We got the following error when building the: ' +error);
    //     });
    return sharable_link;

  }

  /**
   * Function Description: Share yout product
   */
 async shareAsync  () {
    console.log('Starting share async');
    //url='https://cargodev.page.link/bAmq';
    url= await this.getSharableLink(this.state.id);//get the sharable link
    console.log('Product Sharable Link: '+url);
    try {
      const result = await Share.share({
        message: url,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
    
  }

  /**
   * Function Description: Get the location async
   */
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
          deliveryCharge: deliveryCharge,
          currentGpsLocationStringFormat: responseJson.origin_addresses[0]
        })

      })
      .catch((error) => {
        console.error(error);
      });
  
    };

  
  componentDidMount() {
    // List to the authentication state
    this._unsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
    this.props.navigation.setParams({ shareAsync: this.shareAsync});
    //this._getLocationAsync();
  }

  componentWillUnmount() {
    // Clean up: remove the listener
    this._unsubscribe();
    this.focusListener.remove();
  }

  onAuthStateChanged = user => {
    // if the user logs in or out, this will be called and the state will update.
    // This value can also be accessed via: firebase.auth().currentUser
    if (user != null){
      if(user.emailVerified){ // note difference on this line
        this.setState({ User: user});
      }
    }
    else{
      this.setState({ User: null});
    }
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
 

  NavigateToCheckout() {
    if(this.state.User != null){
      const { navigate } = this.props.navigation;
      //this.props.navigation.dispatch(StackActions.popToTop());
      navigate('Checkoutscreen', {userID:this.state.userID ,TotalCartAmount:this.state.price, DeliveryCharge: this.state.deliveryCharge, Title: this.state.title, SellerAddress: this.state.pickupAddress,  GPSLocation: this.state.currentGpsLocationStringFormat, productID: this.state.id, sellerDeliveryPrice: this.state.sellerDeliveryPrice, deliveryProvider: this.state.deliveryProvider, deliveryVehicle: this.state.deliveryVehicle })}
    else{
      this.setState({
        showAlert: true
      });
    }
  };

  CancelOrder() {
    var productStatusReference = firebase.firestore().collection('Products').doc(this.state.id);
    const {navigation} = this.props;
    //navigation.navigate('Account');

    return productStatusReference.update({
        Status:'pending'
    })
    .then(function() {
        console.log("Document successfully updated!");
        //alert('Your order has cancelled!');

        Alert.alert(  
          'Alert !',  
          'Your order has cancelled!',  
          [ 
            {text: 'OK', onPress: () => navigation.navigate('Home')},  
          ]  
      );  
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

  };

  ReactivateOrder() {
    var productStatusReference = firebase.firestore().collection('Products').doc(this.state.id);
    const {navigation} = this.props;
    //navigation.navigate('Account');

    return productStatusReference.update({
        Status:'active'
    })
    .then(function() {
        //alert('Your order has cancelled!');
        Alert.alert(  
          'Thank You',  
          'Your product is activated!',  
          [ 
            {text: 'OK', onPress: () => navigation.navigate('Home')},  
          ]  
      );  
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

  };

  NavigateToMessage() {
    if(this.state.User != null){
    const { navigate } = this.props.navigation;
    //this.props.navigation.dispatch(StackActions.popToTop());
      navigate('ChatDetailMessagesScreen', {completeChatThread: this.state.completeChatThread, userID:this.state.userID, owner: this.state.owner, previousScreen: 'Details', sellerName : this.state.sellerName})
  }
    else{
      this.setState({
        showAlert: true
      });
    }
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
      category: this.state.Category,
      thumbnail:this.state.thumbnail,
    }

    console.log("Before edit cat -->" + data.category);

    //this.props.navigation.dispatch(StackActions.popToTop());
    navigate('EditProduct',{data: data})

    //this.resetStack(data);
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
          onPress={navigation.getParam('shareAsync')}
          style={{ marginRight: 10 }}
        >
          <Ionicons name='md-share' size={30} color={Colors.primary} />
        </TouchableHighlight>
      ),
      headerLeft: (
        <TouchableOpacity onPress={ () => navigation.navigate(navigation.state.params.prevPage)}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Ionicons  name={Platform.OS === "ios" ? `ios-arrow-back` : `md-arrow-back`} color={Colors.primary} style={{ marginLeft: 13 , marginTop: 10, fontSize:35}} />
              {/* <Text style={{ color:Colors.primary, marginLeft: 5 , marginTop: 10, fontSize:13, marginRight:10}}>{navigation.state.params.prevPage}</Text> */}
            </View>
        </TouchableOpacity>
      ),
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
    console.log(this.state.BoughtStatus)

    if (this.state.Status === 'active' && this.state.owner != '' && this.state.owner === this.state.userID && this.state.deliveryCharge != '' ) {

      return (
        <View style ={{flexDirection:'row',justifyContent:'space-evenly'}}>

          <Button light rounded large style={styles.secondaryButton} onPress={this.NavigateToEdit}>
            <Text style={styles.secondaryText}>Edit</Text>
          </Button>

          <Button light rounded large style={styles.secondaryButton} onPress={this.sooldItem}>
            <Text style={styles.secondaryText}>Mark sold</Text>
          </Button>

        </View>
          
      );
    }

    else if(this.state.Status === 'sold' && this.state.owner != '' && this.state.owner === this.state.userID && this.state.deliveryCharge != '' ){
      return (
        <View style ={{flexDirection:'row',justifyContent:'space-evenly'}}>
          <Button large-green style={styles.buttonLarge} onPress={this.ReactivateOrder}>
            <Text style={styles.lightText}>Reactivate Product</Text>
          </Button>
        </View>
      );
    }

    else if(this.state.Status === 'bought' && this.state.owner != '' && this.state.owner === this.state.userID && this.state.deliveryCharge != '' && this.state.BoughtStatus == 'true'){
      return (
        <View style ={{flexDirection:'row',justifyContent:'space-evenly'}}>
          <Button large-green style={styles.buttonLarge} >
            <Text style={styles.lightText}>Product Sold</Text>
          </Button>
        </View>
      );
    }

    else if(this.state.deliveryCharge != '' && this.state.Status === 'bought' && this.state.BuyerID === this.state.userID){
      return (
        <View style ={{flexDirection:'row',justifyContent:'space-evenly'}}>

          <Button large-green style={styles.buttonLarge} onPress={this.CancelOrder}>
            <Text style={styles.lightText}>Cancel Order</Text>
          </Button>

        </View>
      );
    }

    
    else {
        if (this.state.deliveryCharge != '' ) {
        return (
          <View style ={{flexDirection:'row',justifyContent:'space-evenly'}}>

            <Button light rounded large style={styles.secondaryBlueButton} onPress={this.NavigateToCheckout}>
              <Text style={styles.secondaryWhiteText}>Buy Now</Text>
            </Button>
            

            <Button light rounded large style={styles.secondaryBlueButton} onPress={this.NavigateToMessage}>
              <Text style={styles.secondaryWhiteText}>Chat Now</Text>
            </Button>

          </View>
        );
      }
      else {

        return (
        <View style ={{flexDirection:'row',justifyContent:'space-evenly'}}>
          
          <Button light rounded large style={styles.secondaryBlueButton}>
            <Text style={styles.secondaryWhiteText}>Buy Now</Text>
          </Button>
          

          <Button light rounded large style={styles.secondaryBlueButton}>
            <Text style={styles.secondaryWhiteText}>Chat Now</Text>
          </Button>

        </View>
        );
      }
    }
  }

  sooldItem =() =>{
    var tempArray = [...this.state.soldArray];
    tempArray.push(this.state.id)

    this.ref.update({
      SoldProducts:tempArray,  
    })  
    var updateProduct = firebase.firestore().collection('Products').doc(this.state.id);

    updateProduct.update({
      Status:'sold',
    })

    Alert.alert(  
      'Alert !',  
      'Thank you for updating !',
      [ 
        {text: 'OK', onPress: () => this.props.navigation.navigate('Home')},  
      ]
    ); 
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
            onCurrentImagePressed={ () => this.props.navigation.navigate('ImageScreen' , {pictures: this.state.pictures})}
            
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
            //parentWidth={this.state.width}
          />
         

      </View>    

        {/* <View style={styles.infotext}> */}
          <View style={styles.nameAndPrice}>
            <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">{this.state.title}</Text>
            <Text style={styles.productPrice} numberOfLines={2} ellipsizeMode="tail">$ {this.state.price}</Text>
          </View>
        
          <Text style={styles.productDesc}>{this.state.description}</Text>
        {/* </View> */}


        </ScrollView>
         <View >
           <Text style={styles.reportAd} onPress={this.flagTheItem}> Report Ad </Text>   
         </View>

        <View style={styles.BottomPart}>
          {this.CheckIfProductAlreadyInCart()}
        </View>

        <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="   Alert   "
            message="Please login first!"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={true}
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
    paddingTop:Dimensions.get('screen').height*0.01,
    paddingHorizontal:Dimensions.get('screen').width*0.03,
    flexWrap: 'wrap',
    flex: 0.7,
  },
  productPrice: {
    fontSize: 25,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    flex:0.3,
    textAlign:'right',
    paddingHorizontal:Dimensions.get('screen').width*0.03,
    paddingTop:Dimensions.get('screen').height*0.01,
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
    //fontWeight: '100',
    marginTop:10,
    //marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    paddingHorizontal:Dimensions.get('screen').width*0.03, 
  },
  price: {
    fontSize: 18,
    fontWeight: '500',
  },
  priceDr: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  LocViewAndPrice: {
    flexDirection: 'row',
    //marginTop: 5
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
    paddingHorizontal:Dimensions.get('screen').width*0.03,
  },
  buttonLarge: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: Dimensions.get('window').width - 100,
    borderRadius: 100,
    margin: 5,
    backgroundColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5
  },
  secondaryButton: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 175,
    margin: 5
  },
  secondaryBlueButton: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 175,
    margin: 5,
    backgroundColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 1.2
  },
  secondaryText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 1.2
  },
  secondaryWhiteText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 1.2
  },
  lightText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 1.2
  },
  icon: {
    padding: 5,
    paddingRight: 10
  }
});
