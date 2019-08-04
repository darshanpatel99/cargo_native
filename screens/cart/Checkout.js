import React, { Component } from 'react';
import { View, StyleSheet, Picker } from 'react-native';
import {
  Button,
  Text,
  Card,
  Icon,
  CardItem,
  Body,
  Form,
} from 'native-base';
// import ProductCardComponent from '../../components/product/ProductCardComponent';

export default class Checkout extends Component {

  
  constructor(props) {
    super(props);
    this.state = {
      selected2: undefined,
      language: "hello"
    };
  }
  myonValueChange = (value) => {
    this.setState({
      selected2: value
    });
  }
  render() {
    var itemsTotal = 30;
    var itemsTip = 5;
    return (
      <View style={Styles.Container}>
        <Text >Delivery Address:</Text>
        <Card>
          <Picker
            mode='dropdown'
            iosIcon={<Icon name='arrow-down' />}
            placeholder='Select your delivery address'
            selectedValue={this.state.selected2}
            onValueChange={(value) => this.setState({selected2: value})}
          >
            <Picker.Item label='Address1' value='Address1' />
            <Picker.Item label='Address2' value='Address2' />
            <Picker.Item label='Address3' value='Address3' />
          </Picker>
          <View style={Styles.payText}>
          <Button><Text>Edit</Text></Button>
          <Button><Text>Add</Text></Button>
          <Button><Text>Delete</Text></Button>
          </View>

          
          </Card>
          <Text >Items Total</Text>
          <Card>
          <CardItem>
            <Body >
              <Text style={Styles.subTotalText}>Items total: ${itemsTotal}</Text>
              <Text>Items tip: ${itemsTip}</Text>
              <Text>Total: ${itemsTotal+itemsTip}</Text>
            </Body>
          </CardItem>
        </Card>

   
        <View >
          <Button large-green style={Styles.payButton}>
            <Text>Pay</Text>
   
          </Button>
        </View>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    marginLeft: 10,
    marginEnd: 10,
    padding: 5,
    // fontFamily: 'quicksand-regular'
  },
  payButton: {
    marginTop: 10,
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    // fontFamily: 'quicksand-bold'
  },
  payText: {
    flex: 0,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    alignContent: "stretch",
  },

 subTotalText: {
  flex: 0,
  flexDirection: "row",
  alignItems: "flex-end",
  justifyContent: 'flex-end',
  // fontFamily: 'quicksand-bold'
  }
});
