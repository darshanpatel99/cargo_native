import React from 'react';
import { createStackNavigator } from 'react-navigation';
import CartScreen from '../screens/cart/Cart';
import CheckoutScreen from '../screens/cart/Checkout';
import TabBarIcon from '../components/navigation/TabBarIcon';
import { Button, Icon, Text } from 'native-base';

export default (CartStack = createStackNavigator({
  Cart: {
    screen: CartScreen
    // navigationOptions: {
    //   header: null
    // }
  },
  Checkout: {
    screen: CheckoutScreen,
    navigationOptions: {
      headerRight: (
        <Button iconLeft transparent style={{ marginEnd: 10 }}>
          <Icon style={{ fontSize: 30 }} type='EvilIcons' name='user' />
        </Button>
      ),
      headerTitle: (
        <Text style={{ fontFamily: 'quicksand-bold' }}>Checkout</Text>
      )
    },
    // headerStyle: {
    //   // elevation: 0,
    //   // shadowColor: 'transparent',
    //   // shadowOffset: { height: 0, width: 0 },
    //   // shadowOpacity: 0,
    //   // borderBottomWidth: 0,
    //   backgroundColor: 'red' 
    // }
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0
    }
  }
}));

CartStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  if (navigation.state.routes.length > 0) {
    navigation.state.routes.map(route => {
      if (route.routeName === 'Cart') {
        tabBarVisible = true;
        header: null;
      } else {
        tabBarVisible = false;
      }
    });
  }

  return {
    tabBarVisible,
    // headerStyle: {
    //   elevation: 0,
    //   shadowColor: 'transparent',
    //   shadowOffset: { height: 0, width: 0 },
    //   shadowOpacity: 0
    // },
    tabBarIcon: ({ focused }) => (
      <TabBarIcon type='AntDesign' name='shoppingcart' />
    )
  };
};
