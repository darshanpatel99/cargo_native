import React from 'react';
import {Image, View, Linking, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button } from "native-base";
import Colors from "../../constants/Colors";

export default class TestScreen extends React.Component {

  constructor(props) {
    super(props);
    this.dialCall = this.dialCall.bind(this);
  }

  dialCall(){ 
    let phoneNumber = '';
    phoneNumber = `${Platform.OS === 'ios' ? 'tel:' : 'tel:'}${12508193073}`;
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

          <Button large-green style={styles.button} onPress={this.dialCall}>
            <Text style={styles.lightText}>Call Us</Text>
          </Button>

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

  lightText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 1.2
  },
  button: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    height: 50,
    width: Dimensions.get('window').width - 100,
    margin: 5,
    backgroundColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5
  },

}