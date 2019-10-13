import React from 'react';
import {Image, View, Linking, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button } from "native-base";
import Colors from "../../constants/Colors";
import { StackActions, NavigationActions } from 'react-navigation';
import firebaseChat from '../../FirebaseChat';
import { colors } from 'react-native-elements';
import firebase from '../../Firebase.js';

export default class paymentSuccess extends React.Component {

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const productId= navigation.getParam('productId');
    //const orderNo = 0;
    
    this.state={
      orderNumber: '',
    }

    firebase.firestore().collection('Products').doc(productId).get().then((doc)=>{
      var data = doc.data();

      var orderNo = JSON.stringify(data.OrderNumber);
      console.log("Order Number:" + orderNo);
      this.setState({orderNumber: orderNo});
    });
   
  }
  

  navigateToHome(){
    const resetAction = StackActions.reset({
        index: 0, // <-- currect active route from actions array
        actions: [
          NavigationActions.navigate({ routeName: 'Home'} ),
        ],
      });
      this.props.navigation.dispatch(resetAction);
  };

  render() {

    return (
      <View style={styles.viewStyle}>
        <View style={styles.textStyle}>
          <Text style={styles.textHeader}>Hello {firebaseChat.userDisplayName},</Text>
          <Text style={styles.textContent}>
            Thank you for shopping with CarGo.
        </Text>
        <Text style={styles.textContent}>
            We will be in contact with you shortly regarding delivery details. We value your business and hope to see you again.
        </Text>
        <Text style={styles.textContent}>
            Your order number is <Text style={{fontWeight: 'bold', color: colors.primary}}>{this.state.orderNumber}</Text>
        </Text>
        </View>

        <View style={styles.buttonsWithLogo}>

          <Button large-green style={styles.button} onPress={() => this.navigateToHome()}>
            <Text style={styles.lightText}>Ok</Text>
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
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle:{
    flex:0.7,
    flexDirection: 'column',
    alignItems:'center',
  },
  textHeader:{
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 100,
    marginBottom: 25,
  },
  textContent:{
    fontSize: 20,
    margin: 10,
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
