import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import React, { Component } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  ScrollView,
  View
} from 'react-native';
import { Constants } from 'expo';

const homePlace = {
    description: 'Home',
    geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
  };
  const workPlace = {
    description: 'Work',
    geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
  };
  
export default class GooglePlaces extends Component {

    
    render(){
        return(

            <View style={{flex: 1 }}>

                <GooglePlacesAutocomplete
                placeholder='Pickup Address'
                minLength={2}
                autoFocus={false}
                returnKeyType={'default'}
                fetchDetails={true}
                renderDescription={row => row.description} // custom description render
                onPress={(data, details = null) => {
                    console.log(data);
                    console.log('*************************')
                    console.log(details);
                    console.log(Object.values(details.geometry.location))
                    let lat = Object.values(details.geometry.location)[0];
                    let long = Object.values(details.geometry.location)[1];
                    this.props.parentCallback(lat, long);
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
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    borderBottomWidth:0
                    },
                    textInput: {
                    marginLeft: 0,
                    marginRight: 0,
                    height: 38,
                    color: '#5d5d5d',
                    fontSize: 16
                    },
                    predefinedPlacesDescription: {
                    color: '#1faadb'
                    },
                }}
                currentLocation={false}
                />
            </View>
        )
        
    }
}

