import { createStackNavigator } from 'react-navigation-stack';
import PostProductScreen from '../screens/addProduct/PostProductScreen';

export default AddProductStack = createStackNavigator({

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
      if (route.routeName === 'AddProduct') {
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