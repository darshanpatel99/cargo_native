import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { withNavigation } from 'react-navigation';
import ProductThumbnail from './ProductThumbnail';
import Colors from '../../constants/Colors';

class ProductCardComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {title: '', description: '', price :'', image: '', id:'' , owner:'', pickupAddress: '', BuyerID:'', Status:'',Category: 0, deliveryProvider: '', deliveryVehicle: '', sellerDeliveryPrice: ''};
    }

    render() { 
        return (
            // <TouchableOpacity onPress={ () => this.props.navigation.push('Details',  {prevPage:this.props.completeProductObject.prevPage, BoughtStatus:this.props.completeProductObject.BoughtStatus,  Status:this.props.completeProductObject.Status, itemId:this.props.completeProductObject.id, owner:this.props.completeProductObject.owner, title:this.props.completeProductObject.title, description:this.props.completeProductObject.description, price:this.props.completeProductObject.price, pictures:this.props.completeProductObject.pictures, pickupAddress:this.props.completeProductObject.pickupAddress, sellerName: this.props.completeProductObject.sellerName, BuyerID:this.props.completeProductObject.BuyerID, thumbnail:this.props.completeProductObject.thumbnail, Category : this.props.completeProductObject.category, deliveryVehicle: this.props.completeProductObject.deliveryVehicle, deliveryProvider: this.props.completeProductObject.deliveryProvider, sellerDeliveryPrice: this.props.completeProductObject.sellerDeliveryPrice} ) } >
            <TouchableOpacity onPress={ () => this.props.navigation.push('Details',  { completeProductObject: this.props.completeProductObject, prevPage: 'Home' } ) } >
            <View style = {styles.containerStyle}>
                
             {/* This is thumbnail container  */}
                <View style = {styles.thumbnailContainer}>
                    <ProductThumbnail url = {this.props.completeProductObject.Thumbnail}/>    
                </View>
            {/* This is main content container with title and desc */}
                <View style = {styles.contentContainer}>
                    <Text style = {styles.titleStyle} numberOfLines={2} ellipsizeMode="tail">{this.props.completeProductObject.Name} </Text>
                    <Text style = {styles.descriptionStyle} numberOfLines={2} ellipsizeMode="tail">{this.props.completeProductObject.Description}</Text> 
                    {/* <SmallButtonComponent text ={this.props.price} buttonColor = {Colors.secondary}/> */}
                </View>
            {/* This is right icons container */}
                <View style = {styles.rightSideIconsContainer}>
                    {/* <ProductVerticalBar /> */}

                    <Text style={[styles.priceStyle,{color:Colors.secondary}]}>${this.props.completeProductObject.Price}</Text>
                </View>
            </View>
            {/* <Text>{this.props.id}</Text> */}
            </TouchableOpacity>
        )
    }

}


const styles = {

    containerStyle:{

        flexDirection: 'row',
        margin: 10,
        borderRadius: 5,
        //padding: 10,        justifyContent: 'space-between', 
        height: 125,
        // background: "#FDFCF5",
        backgroundColor:'#FDFCF5',
        shadowColor: 'grey',
        shadowOpacity: 0.4,
        shadowRadius: 5,
        shadowOffset: {
          height: 1,
          width: 0
        },
    },

    thumbnailContainer: {
        padding: 10,
    },

    contentContainer : {
        //flexDirection: 'column',
        flex: 2,
        //justifyContent: 'space-between',
        marginLeft: 5,
        marginBottom:20,
        padding: 10,
        
    },

    rightSideIconsContainer : {
        flex: 1,
        justifyContent: 'center',
        //padding: 10,
        // borderWidth:5,
        // borderColor:'black',
        alignItems:'center',
        //backgroundColor:Colors.secondary
    },

    titleStyle: {
        fontWeight: '900',
    },
    descriptionStyle :{
        flexWrap: 'wrap',
    },
    priceStyle:{
        fontWeight:'900',
        fontSize:20,
        
    }
}


export default withNavigation (ProductCardComponent);