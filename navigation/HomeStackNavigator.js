import React from 'react';
import { Button, } from 'react-native';
import { createStackNavigator } from 'react-navigation';
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
    //navigationOptions: {
    //   title: 'Detail',
    //   headerRight: (
    //     <Button
    //       onPress={this.props.navigation.push('Cart')}
    //       title="Cart"
    //       color="#fff"
    //     />
    //   ),
    // },

    // navigationOptions : {
      
    //   headerRight: (
    //     <Button
    //       onPress={() => navigation.navigate('Cart')}
    //       title="Info"
          
    //     />
    //   ),
    // },

  },

  Cart: {
    screen: CartScreen,
    navigationOptions: {
      title: 'Cart',
    }
  },
  
}));

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === 'Home') {
        tabBarVisible = true;
      } 
       else {
        tabBarVisible = false;
      }
    });
  }

  return {
    tabBarVisible,
    tabBarIcon: ({ focused }) => <TabBarIcon type='AntDesign' name='home' />
  };


};

// Details.navigationOptions = ({ navigation }) => {
        
//   headerRight: (navigation) => {
//     // The navigation prop has functions like setParams, goBack, and navigate.
//     let right = (
//       <Button
//         title="Options"
//         onPress={() => navigation.navigate('Cart')}
//       />
//     );
//     return { right };
//   }

// }