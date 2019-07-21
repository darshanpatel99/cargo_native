import React from "react";
import { View, Text, Button } from "react-native";


export default class CartScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      counter: 0
    }
  }
    render() {
    const { navigation } = this.props;
    const Number = navigation.getParam('count');
    console.log(JSON.stringify(Number));

      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>Cart Screen</Text>
          <Text>
          {JSON.stringify(Number)}
          </Text>
        </View>
      );
    }
  }