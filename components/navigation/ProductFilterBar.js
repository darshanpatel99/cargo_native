import React, {Component} from 'react';
import {View} from 'react-native';
import SmallButtonComponent from '../theme/SmallButtonComponent';
import {FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { ScrollView } from 'react-native-gesture-handler';


let filters = {price : 30, city: 'kamloops', sort: 'trending', category: 'Electronics'}
let buttonCurrentState= {price: false, city: true, sort: false, category: false}

export default class ProductFilterBar extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (

            <View style = {styles.containerStyle}>
                <ScrollView style = {styles.scrollStyle} horizontal={true}>
                        <FontAwesome name= "filter" size={24} color={Colors.primary} style = {styles.carImageContainer}/>
                        <SmallButtonComponent text = "$50" buttonColor = {Colors.primary}/>
                        <SmallButtonComponent text = "Kamloops" buttonColor = {Colors.primary}/>
                        <SmallButtonComponent text = "Trending" buttonColor = {Colors.primary}/>
                        <SmallButtonComponent text = "Category" buttonColor = {Colors.primary}  />
                        <SmallButtonComponent text = "Category" buttonColor = {Colors.primary} />
                        <SmallButtonComponent text = "Category" buttonColor = {Colors.primary} style = {{marginRight: 30}}/>

                </ScrollView>
            </View>
        );
    }


}

const styles = {
    containerStyle: {
        marginBottom: 10,
        marginTop: 10,

    },
    scrollStyle: {

    },
    filterStyle :{
        backgroundColor: '#00aeef',
        borderColor: 'red',
        borderWidth: 5,
        borderRadius: 15 
    },
    carImageContainer: {
        marginRight: 20
    },
    viewContainer:{
        flexDirection:'row',
        flexWrap: 'wrap',

    },
 
}