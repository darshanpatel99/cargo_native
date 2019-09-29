import React from 'react';
import {  Platform,   KeyboardAvoidingView,View, StyleSheet, Dimensions, TextInput,Keyboard,TouchableWithoutFeedback, } from 'react-native';
import { Header,StackActions, NavigationActions } from 'react-navigation';
import Constants from 'expo-constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import firebase from '../../Firebase.js';
import { Text, Button } from "native-base";
import Colors from "../../constants/Colors";
var KEYBOARD_VERTICAL_OFFSET_HEIGHT = 0;


const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
 );

export default class UserAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        UID:'',
        addressArray:[],
        Address:'',
        UnitNumber:'',
        PhoneNumber: '',
    };

    this.finishFunc = this.finishFunc.bind(this);
  };

  componentDidMount(){
    const {navigation} = this.props;
    const testId = navigation.getParam('userId')
    this.setState({UID: testId})
  }


  componentWillMount() {

    // Here Im calculating the height of the header and statusbar to set vertical ofset for keyboardavoidingview
    const headerAndStatusBarHeight = Header.HEIGHT + Constants.statusBarHeight;
    KEYBOARD_VERTICAL_OFFSET_HEIGHT =
      Platform.OS === 'ios'
        ? headerAndStatusBarHeight - 700
        : headerAndStatusBarHeight;
  }


  finishFunc(){

    console.log("Inside fuction!");

    var userCollectionReference = firebase.firestore().collection('Users').doc(this.state.UID);

    if(this.state.Address != '' && this.state.PhoneNumber != ''){

    // const {navigation} = this.props;
    // navigation.navigate('Account');
    this.resetStack();

    //userCollectionReference.update(data);

    return userCollectionReference.update({
        Street: this.state.addressArray,
        Address: this.state.Address,
        UnitNumber: this.state.UnitNumber,
        PhoneNumber: this.state.PhoneNumber,
    })
    .then(function() {
        console.log("Document successfully updated!");
        
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

    }
    else{
        alert('Please enter required fields!')
    }
  }

  resetStack = () => {
    this.props
      .navigation
      .dispatch(StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Account',
          }),
        ],
      }))
   }

  ifInputEmpty =() =>{
      if(this.state.Address != ''){
        return true
      }
      return false
  }

  render() {
   
      return (

        <DismissKeyboard>

        <View style={styles.container}>

          {/* <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior='padding'
            keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET_HEIGHT}
          > */}

          <View style={styles.topTitle}>
            <Text style={{
              marginLeft: 15,
              fontSize: Dimensions.get('screen').width * 0.08,
              fontFamily: 'nunito-SemiBold',
              color:'white',

            }}>Phone no. & Address</Text>

          </View>

          <View style={styles.bottomContainer}>
            <View>
            <TextInput
                style={styles.textInputStyle}
                //keyboardType='numeric'
                returnKeyType='done'
                placeholder="Apt number (Optional)"
                onChangeText={(text) => this.setState({UnitNumber: text})}
                value={this.state.UnitNumber}
                maxLength ={8}
            />

            <TextInput
                style={styles.textInputStyle}
                keyboardType='numeric'
                returnKeyType='done'
                placeholder="Phone Number : "
                onChangeText={(text) => this.setState({PhoneNumber: text})}
                value={this.state.PhoneNumber}
                maxLength ={12}
            />
            </View>
                 
          </View>
            

        <View style={this.ifInputEmpty()? styles.inputAddressContainer : styles.inputAddressContainer}>
          <GooglePlacesAutocomplete
            ref={c => this.googlePlacesAutocomplete = c}
            placeholder='Your Address'
            minLength={2}
            autoFocus={false}
            returnKeyType={'default'}
            fetchDetails={true}
            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
            listViewDisplayed='false'    // true/false/undefined
            renderDescription={row => row.description} // custom description render
            
            // textInputProps={{
            //   onChangeText: (text) => {this.testFunction(text)}
            // }}

            onPress={(data, details = null) => {
            console.log(details.formatted_address)
            console.log(Object.values(details.geometry.location))
            let address = (details.formatted_address);
            let lat = Object.values(details.geometry.location)[0];
            let long = Object.values(details.geometry.location)[1];
            this.setState({addressArray: [lat, long]})
            this.setState({googleAddressEmpty: 'Added stuff'})
            this.setState({Address: address})
            //this.props.parentCallback(this.state.lat, this.state.long);
            //console.log('LAT --> ' + Object.values(details.geometry.location)[0])
            }}
            currentLocation={false}
                
                GoogleReverseGeocodingQuery={{
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                }}

                GooglePlacesSearchQuery={{
                  // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                  rankby: 'distance',
                  input :'address',
                  circle: '5000@50.676609,-120.339020',
                }}

               

                getDefaultValue={() => {
                    return ''; // text input default value
                }}
                query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: 'AIzaSyAIif9aCJcEjB14X6caHBBzB_MPSS6EbJE',
                    language: 'en', // language of the results
                    types: 'geocode', // default: 'geocode'
                    location: '50.66648,-120.3192',
                    region: 'Canada',
                    radius: 20000,
                    strictbounds: true,

                    types: 'address', // default: 'geocode'
                }}

            styles={{
                textInputContainer: {
                    width: '100%',
                    height:40,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    borderBottomWidth:0
                },
                description: {
                    fontWeight: 'bold'
                },
                predefinedPlacesDescription: {
                    color: '#1faadb'
                },
                textInput: {
                  height: 38,
                  color: '#5d5d5d',
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor:Colors.primary,
                 marginHorizontal:Dimensions.get('screen').width*0.1,
                  },
                }}
            currentLocation={false}
            />

        </View>

        <View style ={{flexDirection:'row',justifyContent:'space-evenly',}}>
          <Button large-green style={styles.button} onPress={this.finishFunc}>
            <Text style={styles.lightText}>Done</Text>
          </Button>
        </View>
      </View>
      </DismissKeyboard>
      
      );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'column',
    //alignItems: 'center',
    backgroundColor: '#fff',
    //marginTop: Dimensions.get('screen').height*0.1,
  },
  topTitle:{
    flex:0.15,
    justifyContent:'flex-end',
    backgroundColor:Colors.secondary,
    // borderColor:'black',
    // borderWidth:0.5,
    //marginTop: Dimensions.get('window').height*0.08,
  },
  inputAddressContainer: {
    flex: 0.3, 
     alignItems: 'center',
     justifyContent:'center',
    // backgroundColor: '#fff',
    // borderColor:'black',
    // borderWidth:0.5,
    //marginTop: 40,
    //marginTop:Dimensions.get('window').width*0.1,
  },
  addressContainer: {
    flex: 0.1, 
     alignItems: 'center',
     justifyContent:'center',
    // backgroundColor: '#fff',
    //marginTop:Dimensions.get('window').height*0.05,
    // borderColor:'black',
    // borderWidth:0.5,
    marginHorizontal: Dimensions.get('screen').width*0.1,
  },
  bottomContainer: {
    flex: 0.2, 
    //marginTop: 40,
    alignItems: 'center',
    justifyContent:'space-evenly',
    // backgroundColor: '#fff',
    // borderColor:'black',
    // borderWidth:0.5,
    marginHorizontal: Dimensions.get('screen').width*0.01,
  },
  button: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    height: 50,
    width: Dimensions.get('window').width - 100,
    //margin: 5,
    backgroundColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    // borderColor:'black',
    // borderWidth:0.5,
  },

  textInputStyle:{
    height: 40,
    paddingLeft :  Dimensions.get('screen').width*0.01, 
    borderColor: 'white',
    borderWidth: 1,
    borderRadius:10,
    borderBottomColor:Colors.primary, 
    width:Dimensions.get('screen').width - Dimensions.get('screen').width*0.05,
  }
})
