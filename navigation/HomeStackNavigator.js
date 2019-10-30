import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/home/Home';
import CheckoutScreen from '../screens/home/Checkout';
import { ProductScreen } from '../screens/home/ProductScreen';
import EditProductScreen from '../screens/home/EditProductScreen';
import StripeScreen from '../screens/home/StripeScreen'
import ImageScreen from '../screens/home/ImageScreen'
import ChatDetailMessagesScreen from '../screens/message/ChatMessagesScreen'
import PaymentSuccessScreen from '../screens/home/PaymentSuccessScreen'

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
      //title: 'Detail',
      //header: null
    },
  },

  ChatDetailMessagesScreen:{
    screen:ChatDetailMessagesScreen
  },
  ChatFromHomeScreen:{
    screen:ChatDetailMessagesScreen
  },

  StripeScreen: {
    screen: StripeScreen,
    navigationOptions: {
      title: 'Payment',  
    },
  },


  Checkoutscreen: {
    screen: CheckoutScreen,
    navigationOptions: {
      title: 'Checkout',
      //header: null,
    },
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0
    }
  },

  EditProduct: {
    screen: EditProductScreen,
    navigationOptions: {
      header: null,
      
    },
  },

  ImageScreen: {
    screen: ImageScreen,
    navigationOptions: {
      title: 'Image',
    },
  },

  PaymentSuccessScreen:{
    screen:PaymentSuccessScreen,
    navigationOptions: {
      //title: 'Home',
      header: null
    }
  }

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
  //   //tabBarIcon: ({ focused }) => <TabBarIcon type='AntDesign' name='home' />
   };
};