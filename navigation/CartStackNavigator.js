import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import CartScreen from '../screens/cart/Cart';
//import CheckoutScreen from '../screens/home/Checkout';
import TabBarIcon from '../components/navigation/TabBarIcon';

export default (CartStack = createStackNavigator({
  Cart: {
    screen: CartScreen
  },

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
    tabBarIcon: ({ focused }) => (
      <TabBarIcon type='AntDesign' name='shoppingcart' />
    )
  };
};
