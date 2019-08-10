import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'native-base';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import CartHandler from '../../handlers/CartHandler';
import MainButton from '../../components/theme/MainButton';

export default class CartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }

  render() {
    return (
      <View>
        <CartHandler />

       
          {/* <MainButton onPress={() => this.props.navigation.navigate('Checkoutscreen')} title= 'Proceed to Checkout'/> */}
          <Button primary rounded 
            
            onPress={() => this.props.navigation.navigate('Checkoutscreen')}
          >
            <Text>
              Porceed to Checkout
            </Text>
            </Button>
      
      </View>
      //
    );
  }
}
