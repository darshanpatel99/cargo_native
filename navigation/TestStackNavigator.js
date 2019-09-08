import React from 'react';
import {
  createStackNavigator
} from 'react-navigation';
import TestScreen from '../screens/testScreens/Test'; 
import AddressScreen from '../screens/testScreens/AdressTest';
import TabBarIcon from '../components/navigation/TabBarIcon';

export default TestStack = createStackNavigator({
  AddressScreen:{
    screen: AddressScreen,
      navigationOptions: {
        header: null,
      },
  },

  Test:{
    screen: TestScreen,
      navigationOptions: {
        header: null,
      },

  },
});

TestStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible= true;
  
  if (navigation.state.routes.length > 0) {
    navigation.state.routes.map(route => {
      if (route.routeName === 'Test') {
        tabBarVisible = true;
      } else {
        tabBarVisible = false;
      }
    });
  }

  return {
    tabBarVisible,
    tabBarIcon: ({ focused }) => <TabBarIcon type='Entypo' name='bug' />
  };
};