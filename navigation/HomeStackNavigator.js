import React from 'react';
import { Button, } from 'react-native';
import { createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import TabBarIcon from '../components/navigation/TabBarIcon';
import HomeScreen from '../screens/home/Home';
import CartScreen from '../screens/cart/Cart';
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

    // navigationOptions : {
      
    //   headerRight: (
    //     <Button
    //       onPress={() => navigation.navigate('Cart')}
    //       title="Info"
          
    //     />
    //   ),
    // },

  },

  // Cart: {
  //   screen: CartScreen,
  //   navigationOptions: {
  //     title: 'Cart',
  //   }
  // }, 
  
}));

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let headerLeft;
  const prevScreen = navigation.getParam('PreviousScreen');
  console.log('this is home stack gsljhgr' + prevScreen)

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