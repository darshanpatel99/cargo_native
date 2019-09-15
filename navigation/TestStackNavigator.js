import React from 'react';
import {
  createStackNavigator
} from 'react-navigation';
import TestScreen from '../screens/testScreens/Test'; 
import TabBarIcon from '../components/navigation/TabBarIcon';
import AddressTest from '../screens/testScreens/AddressTest'

export default TestStack = createStackNavigator({

  Test:{
    screen: TestScreen,
      navigationOptions: {
        title: 'Help'
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
    //tabBarIcon: ({ focused }) => <TabBarIcon type='Entypo' name='bug' />
  };
};