import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MainButton from '../../components/theme/MainButton';

export class ProductScreen extends Component {
  render() {
    let pics = {
      uri:
        'https://cdn.pixabay.com/photo/2016/12/15/15/18/golf-1909115_960_720.jpg'
    };

    return (
      <View style={styles.container}>
        <View style={styles.pictures}>
          <Image
            source={pics}
            style={{ height: 350, width: 250, borderRadius: 5 }}
          />
        </View>

        <View style={styles.infotext}>
          <Text style={styles.productName}>
            Golf clubs and bag only used once
          </Text>

          <View style={styles.LocViewAndPrice}>
            <View style={styles.productLocView}>
              <Ionicons name='ios-pin' size={18} />
              <Text style={styles.productLoc}>Sahali, Kamloops</Text>
            </View>

            <View style={styles.priceDr}>
              <Text style={styles.price}>2.5$</Text>
              <Ionicons name='ios-car' size={18} />
            </View>
          </View>

          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Text>
        </View>

        <View style={styles.BottomPart}>
          <MainButton title='Add to cart for 125$' />
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
