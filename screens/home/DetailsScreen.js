import React from 'react';
import { View, Text, Button } from 'react-native';

export default class TestScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = { 
    // header: null, 
    // tabBarVisible: false 
  };
  render() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('itemId');
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Button
          title='Home'
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Text>itemId: {JSON.stringify(itemId)}</Text>
      </View>
    );
  }
}
