import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import MainButton from '../../components/theme/MainButton';
import StyledTextInput from '../../components/theme/StyledTextInput';
export default class LoginScreen extends Component {
  render() {
    return (
      <View style={styles.viewStyle}>
        <StyledTextInput placeholder='Email' />
        <StyledTextInput placeholder='Password' />
        <MainButton title='Log in' />
        <MainButton title='Facebook Login' isIcon={true} icon='logo-facebook' />
        <MainButton title='Google Login' isIcon='true' icon='logo-google' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
