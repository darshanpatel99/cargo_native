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

});

AccountStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;

  if (navigation.state.routes.length > 0) {
    navigation.state.routes.map(route => {
      if (route.routeName === 'Account') {
        tabBarVisible = true;
      } else {
        tabBarVisible = false;
      }
    });
  }

  return {
    tabBarVisible,
    tabBarIcon: ({ focused }) => <TabBarIcon type='MaterialCommunityIcons' name='account-circle-outline' />
  };
};
