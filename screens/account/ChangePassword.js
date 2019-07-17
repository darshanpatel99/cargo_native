import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MainButton from '../../components/theme/MainButton';
import StyledTextInput from '../../components/theme/StyledTextInput';

export default class ChangePasswordScreen extends Component {
  render() {
    return (
      <View style={styles.viewStyle}>
        <StyledTextInput placeholder='Old Password' />
        <StyledTextInput placeholder='New Password' />
        <StyledTextInput placeholder='Confirm New Password' />
        <MainButton secondary='true' title='Change Password' />
      </View>
    );
  }
}

const styles = {
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
