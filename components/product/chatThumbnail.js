import React, {Component} from 'react';
import {View, Image, } from 'react-native';
import TempUserAvatar from '../../assets/images/user.png';

var imageHeigth = 0;

var imageWidth = 0 ;
export default class chatThumbnail extends Component {

    constructor(props) {
        super(props);
        
    }

    render() {
        console.log("hello"+this.props.url+"world");

        let tempUri = '';

        if(this.props.url == ''){
            tempUri = require('../../assets/images/user.png');
            
            console.log(tempUri);
        }
        else{
            tempUri = {uri:this.props.url};
        }
        
       // Image.getSize(tempUri, (width, height) => {imageWidth = width ; imageHeigth = height})

        console.log("WWW " + imageWidth + "  HHH" + imageHeigth);

        
        return (
            <View  style={ styles.imageItself } >
                    <Image
                style = {{ width: 50,
                    height:50,
                    borderRadius: 25,}}
                source = {tempUri}
                />
            </View>
                     
                );
    }

}


const styles = {

    imageItself: {
        flex: 1,       
        shadowOpacity: 0.2,
        alignItems:'center',
        justifyContent:'center',
        shadowOffset: {
        width: 0,
        height: 4
        },
    }
}