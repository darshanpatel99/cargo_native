import React from 'react';

import {
  createAppContainer,
  createBottomTabNavigator
} from 'react-navigation';

//Importing stacks for tab navigation bar.
import HomeStack from './HomeStackNavigator';
import AddProductStack from './AddProductStackNavigator';
import CartStack from './CartStackNavigator';
import TestStack from './TestStackNavigator';
import AccountStack from './AccountStackNavigator';
import MessageStack from './MessageStackNavigator';

const AppTabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Account: AccountStack,
    AddProduct:AddProductStack,
    //Cart:CartStack,
    Message:MessageStack,
    Test:TestStack,
  }
);


AppTabNavigator.navigationOptions = {
  header: null,
}
 
export default createAppContainer(AppTabNavigator, AccountStack);