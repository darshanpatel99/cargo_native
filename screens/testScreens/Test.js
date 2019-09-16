import React from 'react';
import { Image, View, TouchableOpacity, Linking, Platform } from 'react-native';
import MainButton from '../../components/theme/MainButton'; //components\theme\MainButton.js

export default class TestScreen extends React.Component {

  constructor(props) {
    super(props);
    this.dialCall = this.dialCall.bind(this);
  }

  dialCall(){ 
    let phoneNumber = '';
    phoneNumber = `${Platform.OS === 'ios' ? 'telprompt:' : 'tel:'}${12508193073}`;
    Linking.openURL(phoneNumber);
  };


  render() {

    return (
      <View style={styles.viewStyle}>
        <View style={styles.logoStyle}>
          <Image
          style={{width: 300, height: 300, borderRadius:20}}
          source={require('../../assets/images/support.png')}
        />
        </View>

        <View style={styles.buttonsWithLogo}>
        <TouchableOpacity activeOpacity={0.7}>
          <MainButton title='Chat Now'/>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.dialCall} activeOpacity={0.7}>
          <MainButton title='Call Us' onPress={this.dialCall}/>
        </TouchableOpacity>
        </View> 

      </View>

    );

  }



}

const styles = {
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
//    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoStyle:{
    flex:0.7,
    
    justifyContent:'center',
  
  },
  buttonsWithLogo:{
    flex:0.3,
    
    justifyContent:'center',
  },

}