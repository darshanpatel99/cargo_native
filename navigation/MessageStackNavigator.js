import { createStackNavigator } from 'react-navigation-stack';
import ChatScreen from '../screens/message/chat';
import ChatMessagesScreen from '../screens/message/ChatMessagesScreen'

export default (MessageStack = createStackNavigator({
  Chat: {
    screen: ChatScreen,
    navigationOptions: {
      title: 'Chat',
      //header: null
    }
  },

  ChatMessagesScreen: {
    screen: ChatMessagesScreen,
    navigationOptions: {
      //title: 'Chat',
      //header: null,
    },
  },
  
  
}));

MessageStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  const prevScreen = navigation.getParam('PreviousScreen');

  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {

      if (route.routeName === 'Chat') {
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