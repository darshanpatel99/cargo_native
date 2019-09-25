import React, {Component} from 'react';
import {View, Image, } from 'react-native';

export default class ProductThumbnail extends Component {

    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <View style = {styles.containerStyle}>                 
                <Image
                style={ styles.imageItself }
                source = {{uri: this.props.url}}
                />    
            </View>     
        );
    }

}


const styles = {

    containerStyle: {
        flex: 1,
        overflow:'hidden',
        width: 100,
        height: 100,
        borderRadius: 10,
        shadowOpacity: 0.2,
        shadowOffset: {
        width: 0,
        height: 4
        },
    },

    imageItself: {

        flex: 1,
        resizeMode: 'contain',
    }
}