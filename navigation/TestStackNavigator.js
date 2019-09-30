import { createStackNavigator } from 'react-navigation-stack';
import TestScreen from '../screens/testScreens/Test'; 

export default TestStack = createStackNavigator({
  Test:{
    screen: TestScreen,
      navigationOptions: {
        title: 'Help'
      },
  },
});

TestStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible= true;
  
  if (navigation.state.routes.length > 0) {
    navigation.state.routes.map(route => {
      if (route.routeName === 'Test' || 'UserAddressScreen') {
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