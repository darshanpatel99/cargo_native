import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Colors from '../../constants/Colors';



export default class PriceComponent extends Component {

    constructor(props) {
        super(props);
        this.state = { text: '', buttonColor: props.buttonColor };
    }

    render() {
        return (
            <View style = {[{backgroundColor: this.props.buttonColor}, styles.containerStyle]}>
                <Text fontWeight = "900" style = {styles.textStyle} > ${this.props.text} </Text>
            </View>
        );
    }



}



const styles = {

    textStyle:{
        textAlign: 'center',
        color: "#fff",
        fontSize: 14,
       
    },
    
    containerStyle: {
        padding:1,
        height: 30,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
        padding: 5
        
    }

}