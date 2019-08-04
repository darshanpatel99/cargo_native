import React from 'react';
import { View, Text, Button } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default class CartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }

  static navigationOptions = props => {
    console.log(
      'THIS IS NAV OPTIONS  ' + props.navigation.getParam('PreviousScreen')
    );
    let prevScreen = props.navigation.getParam('PreviousScreen');
    if (prevScreen == 'ProductScreen') {
      return {
        headerLeft: (
          <FontAwesome
            name='shopping-cart'
            size={50}
            onPress={() => props.navigation.navigate('Home')}
          />
        )
      };
    } else
      return {
        // headerRight: (
        //   <FontAwesome name='shopping-cart' size={50}  onPress={() => props.navigation.popToTop() } />
        // ),
        header: null
      };
  };

  render() {
    // console.log(this.props.navigation.dangerouslyGetParent().routes.length)
    console.log('THIS IS CALLED');
    const { navigation } = this.props;
    const Number = navigation.getParam('count');
    const prevScreen = navigation.getParam('PreviousScreen');
    console.log(prevScreen);
    console.log('this is index ' + navigation.state.routeName);
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Cart Screen from Home</Text>
        <Text>{JSON.stringify(Number)}</Text>

        <Button
          onPress={() => this.props.navigation.navigate('Account')}
          title='Set title'
        />
        <Button
          onPress={() => this.props.navigation.navigate('Checkout')}
          title='Check Out'
        />
      </View>
    );
  }
}
