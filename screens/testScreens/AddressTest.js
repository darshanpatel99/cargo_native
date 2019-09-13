import React, { Component } from 'react';
import { View, StyleSheet, Text, Dimensions, Button } from 'react-native';
import Colors from "../../constants/Colors";
import { SliderBox } from 'react-native-image-slider-box';
export default class UserAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        UID:''
    };
  };


  componentDidMount(){
    const {navigation} = this.props;
    const testId = navigation.getParam('userId')
    this.setState({UID: testId})
  }
  render() {
   

      return (
        <View style={styles.container}>
         <Text>Hello inside User Address page  {this.state.UID}</Text>
         <Button title='Go to account' onPress={ () => this.props.navigation.navigate('Account')}/>
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
