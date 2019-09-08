import React, { Component } from 'react';
import { View, StyleSheet, Text, Dimensions, Button } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default class UserAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        UID:'',
        addressArray:[],
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

            <Text style={{
              marginLeft: 15,
              marginTop: 20,
              fontSize: 30,
              fontFamily: 'nunito-SemiBold'
            }}
                >
            Enter Your Address
          </Text>

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
                //  }}
                onPress={(data, details = null) => {

                console.log(Object.values(details.geometry.location))
                let lat = Object.values(details.geometry.location)[0];
                let long = Object.values(details.geometry.location)[1];
                this.setState({addressArray: [lat, long]})
                this.setState({googleAddressEmpty: 'Added stuff'})
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
                    //backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    borderBottomWidth:0
                    },

                    textInput: {
                    marginLeft: 0,
                    marginRight: 0,
                    height: 45,
                    width: Dimensions.get('screen').width - 10,
                    color: '#5d5d5d',
                    fontSize: 16
                    },
                    predefinedPlacesDescription: {
                    color: '#1faadb'
                    },
                }}
                currentLocation={true}
                />


         <Text>Hello inside User Address page  {this.state.UID}</Text>
         <Button title='Go to account' onPress={ () => this.props.navigation.navigate('Done')}/>
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