import React from "react";
import { View, Text, Button } from "react-native";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import CartHandler from '../../handlers/CartHandler'

export default class CartScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      counter: 0
    }
  }


    render() {

      return (
        <CartHandler />
      );
    
  }
}
  