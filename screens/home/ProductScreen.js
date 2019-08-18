import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import { StackActions } from 'react-navigation';
import { FontAwesome, Ionicons, AntDesign } from '@expo/vector-icons';
import FlipCard from 'react-native-flip-card';
import MainButton from '../../components/theme/MainButton'; //components\theme\MainButton.js
import Colors from '../../constants/Colors.js';
import firebase from '../../Firebase.js';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SliderBox } from 'react-native-image-slider-box';

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

    this.state = {
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
      buttonTitle: 'Add to Cart'
    };
    onLayout = e => {
      this.setState({
        width: e.nativeEvent.layout.width
      });
    };

    this.NavigateToCheckout = this.NavigateToCheckout.bind(this);
    this.NavigateToEdit = this.NavigateToEdit.bind(this);
    this.CheckIfProductAlreadyInCart = this.CheckIfProductAlreadyInCart.bind(this);

    //checking the current user and setting uid
    let user = firebase.auth().currentUser;

    if (user != null) {
        
      this.state.userID = user.uid;
      console.log(" State UID: " + this.state.userID);
    }
  }

  NavigateToCheckout() {
    console.log('checkout called');
    const { navigate } = this.props.navigation;
    //this.props.navigation.dispatch(StackActions.popToTop());
    navigate('Checkoutscreen', {TotalCartAmount:100})
  };

  NavigateToEdit(){
    console.log(' called');
    const { navigate } = this.props.navigation;
    //this.props.navigation.dispatch(StackActions.popToTop());
    navigate('Account');
  };

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      headerRight: (
        <TouchableHighlight
          onPress={params.handleCartItems}
          style={{ marginRight: 10 }}
        >
          <AntDesign name='message1' size={30} color={Colors.primary} />
        </TouchableHighlight>
      )
    };
  };

  CheckIfProductAlreadyInCart() {
    console.log("Running after")
    if (this.state.owner === this.state.userID ) {
      return (
          <Button
            title='Edit Your product'
            onPress={this.NavigateToEdit}
          />
      );
    } else {
      return (
          <Button
            //color='#fff'
            title='Buy Now'
            onPress={this.NavigateToCheckout}
          />

      );
    }
  }

  render() {
    console.log('getting price as props ======> ' + this.state.price);

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
          <View style={{flex: 1, flexDirection: 'row',justifyContent: 'space-between'}}>
            <Text style={styles.productName}>{this.state.title}</Text>
            <Text style={styles.productPrice}>$ {this.state.price}</Text>
          </View>

          {/* <Text>Local number => {this.state.count} </Text>
         <Text>Total product in firebase => {this.state.cart.length}</Text> */}
          <View style={styles.LocViewAndPrice}>
            <View style={styles.productLocView}>
              <FontAwesome name='map-marker' size={20} color={Colors.primary} />
              <Text style={styles.productLoc}>Sahali, Kamloops</Text>
            </View>
            <View style={styles.priceDr}>
              <Text style={styles.price}>2.5$</Text>
              <FontAwesome name='car' size={22} color={Colors.primary} />
            </View>
          </View>

        
          <Text style={styles.productDesc}>{this.state.description}</Text>
        {/* </View> */}

        </ScrollView>

        <View style={styles.BottomPart}>
          {this.CheckIfProductAlreadyInCart()}
        </View>

      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    //paddingTop: 20,
    backgroundColor: '#fff'
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
    fontSize: 18,
    fontWeight: '500',
    alignItems: 'flex-start',
    marginTop: 10,
    marginLeft: 10,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '500',
    marginRight: 10,
    marginHorizontal:10,
    marginTop: 10
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
    paddingRight: 7
  },
  priceDr: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  LocViewAndPrice: {
    flexDirection: 'row',
    marginTop: 5
  },
  BottomPart: {
    marginBottom: 20,
    //flex: 1,
    alignItems: 'center',
    //paddingBottom: 10,
    //paddingTop: 10
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
  }
});
