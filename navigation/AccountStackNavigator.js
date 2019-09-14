import React from 'react';
import {
  createStackNavigator
} from 'react-navigation';
//importing components
import TabBarIcon from '../components/navigation/TabBarIcon';
//importing screens
import AccountScreen from '../screens/account/Account'; 
import ChangePasswordScreen from '../screens/account/ChangePassword';
import LoginScreen from '../screens/account/LoginScreen';
import SignUpScreen from '../screens/account/SignUpScreen';
import AccountInfoScreen from '../screens/account/AccountInfo';
import firebase from '../Firebase';
import { initAsync } from 'expo-google-sign-in';
import ListingScreen from '../screens/account/ListingScreen';
import BoughtScreen from '../screens/account/BoughtScreen';
import SoldScreen from '../screens/account/SoldScreen';
import UserAddressScreen from '../screens/account/UserAddress';

export default AccountStack = createStackNavigator({

  Account: {
    screen: AccountScreen,
    navigationOptions: {
      title: 'Account',
      header: null,
    },
  },

  ChangePassword: {
    screen: ChangePasswordScreen,
    navigationOptions: {
      //header: null,
    },
  },
    
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      //header: null,
    },
  },

  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
      //header: null,
    },
  },

  UserAddressScreen: {
    screen: UserAddressScreen,
    navigationOptions: {
      header: null,
    },
  },

  AccountInfo: {
    screen: AccountInfoScreen,
    navigationOptions: {
      header: null,
    },
  },
  

  Listing:{
    screen:ListingScreen,
    navigationOptions: {
      title: 'Listing',    
    },    
  },

  Bought:{
    screen:BoughtScreen,
    navigationOptions: {
      title: 'Bought',
    },    
  },

  Sold:{
    screen:SoldScreen,
    navigationOptions: {
      title: 'Sold',
    },    
  }
},

{
  initialRouteName : 'Account'
},
);

AccountStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 0) {
    navigation.state.routes.map(route => {
      if (route.routeName === 'Account' ) {
        tabBarVisible = true;
      }
      else if (route.routeName === 'AccountInfo') {
        tabBarVisible = true;
      }
      else {
        tabBarVisible = false;
      }
    });
  }

  return {
    tabBarVisible,
  };

};
