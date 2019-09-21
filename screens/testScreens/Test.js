import React from 'react';
import {Image, View, Linking, Platform, TouchableOpacity } from 'react-native';
import { Text, Button } from "native-base";
import Colors from "../../constants/Colors";

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

        <TouchableOpacity >
          <Button primary rounded large style={styles.button}>
            <Text style={styles.lightText}>Chat Now</Text>
          </Button>
        </TouchableOpacity>

        <TouchableOpacity  onPress={this.dialCall}>
          <Button primary rounded large style={styles.button}>
            <Text style={styles.lightText}>Call Us</Text>
          </Button>
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
    height: 50,
    width: 300,
    margin: 5,
    backgroundColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5
  },

}