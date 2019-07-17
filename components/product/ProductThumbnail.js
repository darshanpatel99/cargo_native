import React, {Component} from 'react';
import {View, Image, Text} from 'react-native';

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
        borderWidth:2,
        borderRadius: 10,
        borderColor: "#fba21c",
        width: 90,
        height: 90,
    },

    imageItself: {

        flex: 1,
        resizeMode: 'contain',
    }
}