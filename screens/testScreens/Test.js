import React, { Component } from 'react';
import { View, StyleSheet, Text, Dimensions, Button } from 'react-native';
import Colors from "../../constants/Colors";
import { SliderBox } from 'react-native-image-slider-box';
import UserAddress from '../account/UserAddress'

export default class Test extends React.Component {

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const propsUId = navigation.getParam('uid');
    this.props.navigation
    console.log('This is address screen  ' + propsUId)


    this.state = { 
       uid: 'test'
    };


    // this.setState({UID: propsUId});

  };

  render() {

      return (
        <View style={styles.container}>
          <Text>Hello !!!</Text>
        </View>
      );
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  }
})