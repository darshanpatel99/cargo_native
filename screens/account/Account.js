import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MainButton from '../../components/theme/MainButton';
import Header from '../../components/headerComponents/Header';

export default class AccountScreen extends React.Component {
  render() {
    return (
      <View style={{ height: '100%' }}>
        <Header />
        <Button
          title='Go to Change Password Screen'
          onPress={() => this.props.navigation.navigate('ChangePassword')}
        />
         <Button
          title='Go to Change Login Screen'
          onPress={() => this.props.navigation.navigate('Login')}
        />
 <Button
          title='Go to Change Sign Up Screen'
          onPress={() => this.props.navigation.navigate('SignUp')}
        />
        
        <View style={styles.viewStyle}>
          <MainButton title='Login' onPress={() => this.props.navigation.navigate('Login')}/>
          <MainButton secondary='true' title='Sign Up' onPress={() => this.props.navigation.navigate('SignUp')}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
