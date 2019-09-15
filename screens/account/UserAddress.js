import React from 'react';
import { View, StyleSheet, Text, Dimensions, Button, TextInput } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import firebase from '../../Firebase.js';

export default class UserAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        UID:'',
        addressArray:[],
        Address:'',
        UnitNumber:'',
    };

    this.finishFunc = this.finishFunc.bind(this);
  };

  componentDidMount(){
    const {navigation} = this.props;
    const testId = navigation.getParam('userId')
    this.setState({UID: testId})
  }

  testFunction(text){
    //this.state.Address = text;
    //this.setState({googleAddressEmpty: 'test'})
    }


  finishFunc(){

    console.log("Inside fuction!");

    var userCollectionReference = firebase.firestore().collection('Users').doc(this.state.UID);

    if(this.state.Address != ''){

    const {navigation} = this.props;
    navigation.navigate('Account');

    //userCollectionReference.update(data);

    return userCollectionReference.update({
        Street: this.state.addressArray,
        Address: this.state.Address,
        UnitNumber: this.state.UnitNumber,
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
        alert('Please enter your address!')
    }

  }

  ifInputEmpty =() =>{
      if(this.state.Address != ''){
          return true
      }
      
      return false
  }

  render() {
   
      return (
        <View style={styles.container}>

            <View style={styles.topTitle}>
            <Text style={{
              marginLeft: 15,
              fontSize: 30,
              fontFamily: 'nunito-SemiBold'
            }}>
            Enter Your Address
          </Text>

            </View>
            

        <View style={this.ifInputEmpty()? styles.addressContainer : styles.inputAddressContainer}>
          <GooglePlacesAutocomplete
            ref={c => this.googlePlacesAutocomplete = c}
            placeholder='Pickup Address'
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
            GoogleReverseGeocodingQuery={{
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}

            getDefaultValue={() => {
                return ''; // text input default value
            }}
            query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyAIif9aCJcEjB14X6caHBBzB_MPSS6EbJE',
                language: 'en', // language of the results
                types: 'geocode', // default: 'geocode'
            }}

            styles={{
                textInputContainer: {
                    width: '100%',
                    height:40
                },
                description: {
                    fontWeight: 'bold'
                },
                predefinedPlacesDescription: {
                    color: '#1faadb'
                }
                }}
            currentLocation={false}
            />

        </View>

        <View style={styles.bottomContainer}>
            <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1, width:Dimensions.get('screen').width-10 }}
                keyboardType='numeric'
                returnKeyType='done'
                placeholder="Apt number (Optional)"
                onChangeText={(text) => this.setState({UnitNumber: text})}
                value={this.state.UnitNumber}
            />
            <View style ={{flexDirection:'row',justifyContent:'space-evenly'}}>

            {/* <TouchableOpacity  onPress={this.finishFunc}>
                <MainButton title='Done' />
            </TouchableOpacity> */}

            <Button onPress={this.finishFunc} title='Done' />
            </View>
            
        </View>

        </View>
      );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'column',
    //alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: Dimensions.get('screen').height*0.1,
  },
  topTitle:{
    flex:0.05,
  },
  inputAddressContainer: {
    flex: 0.3, 
     alignItems: 'center',
     justifyContent:'center',
    // backgroundColor: '#fff',
    marginTop: 40,
  },
  addressContainer: {
    flex: 0.05, 
     alignItems: 'center',
     justifyContent:'center',
    // backgroundColor: '#fff',
    marginTop: 40,
  },
  bottomContainer: {
    flex: 0.3, 
    marginTop: 40,
    alignItems: 'center',
    // backgroundColor: '#fff',
  }
})