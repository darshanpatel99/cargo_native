import React from 'react';
import { Button, } from 'react-native';
import { createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import TabBarIcon from '../components/navigation/TabBarIcon';
import HomeScreen from '../screens/home/Home';
import CheckoutScreen from '../screens/home/Checkout';
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
      title: 'Detail',
      
    },
 

  },

  Checkoutscreen: {
    screen: CheckoutScreen,
    navigationOptions: {
      header: null,
    },
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0
    }
  },

}));

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let headerLeft;
  const prevScreen = navigation.getParam('PreviousScreen');

  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {

      if (route.routeName === 'Home') {
        tabBarVisible = true;
      } 
       else {
        tabBarVisible = false;
        // headerLeft: (
        //   <Button
        //     onPress={this.props.navigation.pop()}
        //   />
        // )
      }
    });
  }

  return {
    tabBarVisible,
    tabBarIcon: ({ focused }) => <TabBarIcon type='AntDesign' name='home' />
  };
};