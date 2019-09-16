import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {FontAwesome } from '@expo/vector-icons';

export default class ProductVerticalBar extends Component {

    render() {
        return (
            <View style = {styles.containerStyle}> 
                <FontAwesome name= "car" size={24} color="#fba21c" style = {styles.carImageContainer}/>
                <Text><FontAwesome style = {styles.priceStyle} name= "map-marker" size={14} color="#fba21c"/> <Text style = {styles.priceStyle}> $3.34 </Text> </Text>
                <FontAwesome style = {styles.heartStyle} name= "heart-o" size={24} color="#fba21c"/>
            </View>
        );
    }

}


const styles = {
    carImageContainer : {

    },

    containerStyle : {
        flexDirection: 'column',
        alignItems: 'flex-end'
        

    },
    priceStyle: {
        color: "#fba21c",
    },
    heartStyle: {

    }
}