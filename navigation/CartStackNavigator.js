import React from 'react';
import {
  createStackNavigator
} from 'react-navigation';
import CartScreen from '../screens/cart/Cart'; 
import TabBarIcon from '../components/navigation/TabBarIcon';

export default CartStack = createStackNavigator({
  Cart:{
    screen: CartScreen,
      navigationOptions: {
        header: null,
      },

  },
  
});


CartStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible= true;
  
  if (navigation.state.routes.length > 0) {
    navigation.state.routes.map(route => {
      if (route.routeName === 'Cart') {
        tabBarVisible = true;
      } else {
        tabBarVisible = false;
      }
    });
  }

  return {
    tabBarVisible,
    tabBarIcon: ({ focused }) => <TabBarIcon type='AntDesign' name='shoppingcart' />
  };
};