import { createStackNavigator } from 'react-navigation-stack';
import PostProductScreen from '../screens/addProduct/PostProductThird';
import FirstPostProduct from '../screens/addProduct/PostProductFirst';
export default AddProductStack = createStackNavigator({

  FirstPostProduct:{
    screen: FirstPostProduct,
    navigationOptions: {
      // header: null,
      title:'Post Ad'
    },
  },

  AddProduct: {
    screen: PostProductScreen,
    navigationOptions: {
      // header: null,
      title:'Post Ad'
    },
  },


});

AddProductStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible= true;
  
  if (navigation.state.routes.length > 0) {
    navigation.state.routes.map(route => {
      if (route.routeName === 'FirstPostProduct') {
        tabBarVisible = true;
      } else {
        tabBarVisible = false;
      }
    });
  }
  return {
    tabBarVisible,
  };
};