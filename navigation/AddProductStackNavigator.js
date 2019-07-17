import React from 'react';
import {
  createStackNavigator
} from 'react-navigation';
import TabBarIcon from '../components/navigation/TabBarIcon';
import PostProductScreen from '../screens/addProduct/PostProductScreen';

export default AddProductStack = createStackNavigator({

  AddProduct: {
    screen: PostProductScreen,
    navigationOptions: {
      header: null,
    },
  },
});

AddProductStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible= true;
  
  if (navigation.state.routes.length > 0) {
    navigation.state.routes.map(route => {
      if (route.routeName === 'AddProduct') {
        tabBarVisible = true;
      } else {
        tabBarVisible = false;
      }
    });
  }

  return {
    tabBarVisible,
    tabBarIcon: ({ focused }) => <TabBarIcon type='AntDesign' name='camerao' />
  };
};