import React from 'react';
import {createAppContainer,} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

//Importing stacks for tab navigation bar.
import HomeStack from './HomeStackNavigator';
import AddProductStack from './AddProductStackNavigator';
import TestStack from './TestStackNavigator';
import AccountStack from './AccountStackNavigator';
import MessageStack from './MessageStackNavigator';

const AppTabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Account: AccountStack,
    AddProduct:AddProductStack,
    Message:MessageStack,
    Help:TestStack,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-home`;
        } else if (routeName === 'Account') {
          iconName = `ios-contact`;
        }else if (routeName === 'AddProduct') {
          iconName = `ios-camera`;
        }else if (routeName === 'Message') {
          iconName = `ios-text`;
        }else if (routeName === 'Help') {
          iconName = `ios-help-circle`;
        }
        return <IconComponent name={iconName} size={30} color={tintColor} />;
      },
    }),
    
    tabBarOptions: {
      activeTintColor: '#397CFF',
      inactiveTintColor: '#FBA21C',
    },
  }
);
export default createAppContainer(AppTabNavigator, AccountStack);