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


// checkInitialPage = ()=>{
//   console.log("Inside function");
//   var User = null;

//   firebase.auth().onAuthStateChanged((user)=>{
//     User=user;
//     console.log("User object:  "+ User);
//   });

//   if(User!=null){
//     console.log('user is logged in');
//     return "AccountInfo";
//   }
//   else {
//     console.log('User is not logged in');
//     return "Account";
//   }
    
    
// }



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

  AccountInfo: {
    screen: AccountInfoScreen,
    navigationOptions: {
      header: null,
      //headerLeft: false,
    },
  },
  

  Listing:{
    screen:ListingScreen,
    navigationOptions: {
      header: null,
    },    
  },

  Bought:{
    screen:BoughtScreen,
    navigationOptions: {
      header: null,
    },    
  },

  Sold:{
    screen:SoldScreen,
    navigationOptions: {
      header: null,
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

  // return {
  //   tabBarVisible,
  //   tabBarIcon: ({ focused }) => <TabBarIcon type='MaterialCommunityIcons' name='account-circle-outline' />
  // };
};
