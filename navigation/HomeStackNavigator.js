import React from 'react';
import { createStackNavigator } from 'react-navigation';
import TabBarIcon from '../components/navigation/TabBarIcon';

import HomeScreen from '../screens/home/Home';
import { ProductScreen } from '../screens/home/ProductScreen';

export default (HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'Home',
      header: null
    }
  },
  Details: {
    screen: ProductScreen,
    navigationOptions: {
      // header: null,
    }
  },
  // Account: {
  //   screen: AccountScreen
  // }
}));

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === 'Home') {
        tabBarVisible = true;
      } else {
        tabBarVisible = false;
      }
    });
  }

  return {
    tabBarVisible,
    tabBarIcon: ({ focused }) => <TabBarIcon type='AntDesign' name='home' />
  };
};
