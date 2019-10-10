import React, {Component} from 'react';
import {View, Image, } from 'react-native';

var imageHeigth = 0;

var imageWidth = 0 ;
export default class ProductThumbnail extends Component {

    constructor(props) {
        super(props);
        
    }

    render() {
        Image.getSize(this.props.url, (width, height) => {imageWidth = width ; imageHeigth = height})

        console.log("WWW " + imageWidth + "  HHH" + imageHeigth);
        return (
                <Image
                style={ styles.imageItself }
                source = {{uri: this.props.url}}
                />     
                );
    }

}


const styles = {

    imageItself: {
        flex: 1,
        overflow:'hidden',
        width: 60,
        height:100,
        borderRadius: 10,
        shadowOpacity: 0.2,
        shadowOffset: {
        width: 0,
        height: 4
        },
    }
}