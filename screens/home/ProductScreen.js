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
import { StackActions, NavigationActions } from 'react-navigation';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import FlipCard from 'react-native-flip-card';
import MainButton from '../../components/theme/MainButton'; //components\theme\MainButton.js
import Colors from '../../constants/Colors.js';
// import firebase from '../../Firebase.js';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import { isAbsolute } from 'path';
import { SliderBox } from 'react-native-image-slider-box';

export class ProductScreen extends Component {
  constructor(props) {
    super(props);
    // const { navigation } = this.props;
    //  const itemId = navigation.getParam('itemId');
    //this.ref = firebase.firestore().collection('Products').doc(""+itemId).collection("Users").doc("K3xLrQT1OrFirfNXfkYf").get();
    //this.newRef = firebase.firestore().collection('Users').doc("K3xLrQT1OrFirfNXfkYf");

    //  this.ref = firebase.firestore().collection('Users').doc();
    this.state = {
      pictures: [],
      //data: {},
      count: 0,
      cart: [],
      address: {}
    };

    this.DecreaseInCountValue = this.DecreaseInCountValue.bind(this);
    this.IncreaseInCountValue = this.IncreaseInCountValue.bind(this);

    //  this.newRef.onSnapshot(doc => {
    //   this.setState({
    //     address: doc.data().Address,
    //     cart: doc.data().Cart,
    //   });
    //  })

    //  this.ref.onSnapshot(doc => {
    //    this.setState({
    //      pictures: doc.data().Pictures,
    //      address: doc.data(),
    //      cart: doc.data(),
    //      data: doc.data(),
    //    });
    //  });
  }

  DecreaseInCountValue() {
    this.setState({ count: this.state.count - 1 });
    testValue = this.state.count;
  }

  IncreaseInCountValue() {
    this.setState({ count: this.state.count + 1 });
    testValue = this.state.count;
  }

  resetScreen() {
    console.log('Hello');
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: 'Home' })],
    // });
    // this.props.navigation.dispatch(resetAction);
  }

  _onPressButton() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home' })]
    });
    this.props.navigation.dispatch(resetAction);
  }

  //cartLength = this.state.cart.length;

  static navigationOptions = props => {
    return {
      //tabBarVisible: false,
      headerRight: (
        <View>
          
          <FontAwesome
            name='shopping-cart'
            size={50}
            color={Colors.primary}
            onPress={() =>
              props.navigation.push('Cart', { PreviousScreen: 'ProductScreen' })
            }
          />
          <View
            style={{
              position: 'absolute',
              height: 30,
              width: 30,
              borderRadius: 15,
              backgroundColor: 'red',
              right: 15,
              bottom: 15
            }}
          >
            <Text style={{textAlign:"center",top:8}}>0</Text>
          </View>
        </View>
      )

      // headerLeft: (
      //   <FontAwesome name='shopping-cart' size={50} color={Colors.primary} onPress={this.resetScreen} />
      // )
    };
  };

  render() {
    const { navigation } = this.props;
    const title = navigation.getParam('title');
    const description = navigation.getParam('description');
    const price = navigation.getParam('price');
    const pictures = navigation.getParam('pictures');

    console.log(this.state.cart.length);
    console.log(this.state.pictures);


    return (
      <View style={styles.container}>
        <View style={styles.pictures}>
          <View style={{ flexDirection: 'row' }}>
            {/* <ScrollView>
              {pictures.map((item, key) => (
                <View key={key} style={{ flexDirection: 'row' }}>
                  <View style={styles.breaks} />
                  <Image style={styles.images} source={{ uri: item }} />
                  <View style={styles.breaks} />
                </View>
              ))}
            </ScrollView> */}

        <SliderBox
            images={pictures.map((item, key) => (
              <View key={key} style={{ flexDirection: 'row' }}>
                <View style={styles.breaks} />
                <Image style={styles.images} source={{ uri: item }} />
                <View style={styles.breaks} />
              </View>
            ))}
            sliderBoxHeight={200}
            onCurrentImagePressed={index =>
                console.warn(`image ${index} pressed`)
            }
            dotColor="#FFEE58"
            inactiveDotColor="#90A4AE"
            paginationBoxVerticalPadding={20}
            circleLoop
        />


          </View>
        </View>
        <View style={styles.infotext}>
          <Text style={styles.productName}>{title}</Text>
          {/* <Text>Cart {this.state.count} items  length of cart  {this.state.cart.length}</Text> */}
          {/* <Text>{pictures}</Text> */}
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
          <Text>{description}</Text>
          <Button onPress={this._onPressButton.bind(this)} title='Press Me' />
        </View>
        <View style={styles.BottomPart}>
          {/* <TouchableOpacity onPress={() => this.setState({ count: this.state.count + 1 })}>
           <MainButton
           title={'Add to cart $ '+ this.state.data.Price  }
          />
          </TouchableOpacity> */}

          <FlipCard
            style={styles.card}
            friction={6}
            perspective={1000}
            flipHorizontal={true}
            flipVertical={false}
            flip={false}
            clickable={true}
          >
            {/* Face Side */}
            <TouchableOpacity
              onPress={this.IncreaseInCountValue}
              style={styles.face}
            >
              <MainButton
                title={'Add to cart $ ' + JSON.stringify(price) + ' '}
              />
            </TouchableOpacity>

            {/* Back Side */}
            <TouchableOpacity
              onPress={this.DecreaseInCountValue}
              style={styles.back}
            >
              <MainButton title={'remove from cart '} color='red' />
            </TouchableOpacity>
          </FlipCard>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    paddingTop: 20,
    backgroundColor: '#fff'
  },
  breaks: {
    width: Dimensions.get('window').width * 0.05
  },
  images: {
    height: Dimensions.get('window').height * 0.48,
    width: Dimensions.get('window').width * 0.9
  },
  pictures: {
    flex: 6,
    alignItems: 'center'
  },

  infotext: {
    flex: 2.5,
    paddingLeft: 8,
    paddingRight: 5
  },

  productName: {
    fontSize: 18,
    fontWeight: '500'
  },

  productLocView: {
    flexDirection: 'row',
    flex: 0.9,
    alignItems: 'flex-start'
  },
  productLoc: {
    fontSize: 18,
    fontWeight: '500',
    paddingLeft: 7
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
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row'
  },
  BottomPart: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10
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
    fontWeight: '800'
  }
});
