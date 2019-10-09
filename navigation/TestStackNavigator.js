import { createStackNavigator } from 'react-navigation-stack';
import HelpScreen from '../screens/helpScreens/Help'; 

export default HelpStack = createStackNavigator({
  Help:{
    screen: HelpScreen,
      navigationOptions: {
        title: 'Help'
      },
  },
});

HelpStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible= true;
  
  if (navigation.state.routes.length > 0) {
    navigation.state.routes.map(route => {
      if (route.routeName === 'Help' || 'UserAddressScreen') {
        tabBarVisible = true;
      } else {
        tabBarVisible = false;
      }
    });
  }

  return {
    tabBarVisible,
    //tabBarIcon: ({ focused }) => <TabBarIcon type='Entypo' name='bug' />
  };
};