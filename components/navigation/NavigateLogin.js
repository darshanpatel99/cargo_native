import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import Colors from '../../constants/Colors';


export default class PostProductScreen extends Component {
    constructor(props) {
      super(props);
    }
    render() {
        return (
            
            <View style={styles.containerStyle}>
                <Text>Please Login First</Text>
                <Button title="go to login screen" onPress={ () => this.props.navigation.navigate('Account')}/>
            </View>
        );
    }
}

const styles = {
  containerStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
};
