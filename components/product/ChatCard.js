import React, {Component} from 'react';
import {View, Text,Image,Dimensions,} from 'react-native';
import ProductThumbnail from './ProductThumbnail';
import Colors from '../../constants/Colors';

class ChatCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {title: '', description: '', price :'', image: '', id:'' , owner:'', pickupAddress: '', BuyerID:'', Status:''};
    }

    render() {
        return (
            <View style = {styles.containerStyle}>
                
             {/* This is thumbnail container  */}
                <View style = {styles.thumbnailContainer}>
                    <ProductThumbnail url = {'https://firebasestorage.googleapis.com/v0/b/cargo-488e8.appspot.com/o/UserImages%2Favatar.png?alt=media&token=91ea9f59-11a8-4928-9963-0235a0cd5201'}/>    
                    {/* <Image style ={{width:50,height:50}}
                    //'https://firebasestorage.googleapis.com/v0/b/cargo-488e8.appspot.com/o/UserImages%2Favatar.png?alt=media&token=91ea9f59-11a8-4928-9963-0235a0cd5201'
                    //https://cdn.pixabay.com/photo/2016/04/10/21/34/woman-1320810__340.jpg
                    source= {{uri:'https://image.shutterstock.com/image-photo/funny-face-domestic-chinchilla-holding-260nw-604553171.jpg'}}
                    /> */}
                </View>
            {/* This is main content container with title and desc */}
                <View style = {styles.contentContainer}>
                    <Text style = {styles.titleStyle} numberOfLines={2} ellipsizeMode="tail">{this.props.title} </Text>
                    {/* <Text style = {styles.descriptionStyle} numberOfLines={2} ellipsizeMode="tail">{this.props.description}</Text>  */}
                    {/* <SmallButtonComponent text ={this.props.price} buttonColor = {Colors.secondary}/> */}
                </View>

            </View>
        )
    }

}


const styles = {

    containerStyle:{

        flexDirection: 'row',
        //justifyContent:'right',
        margin: 10,
        borderRadius: 40,
        alignItems:'center',
        //padding: 10,        justifyContent: 'space-between', 
        height: 75,
        // background: "#FDFCF5",
        backgroundColor:'#FDFCF5',
       // backgroundColor:Colors.secondary,
        elevation:8,
        shadowColor: 'grey',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: {
          height: 1,
          width: 0
        },
    },

    thumbnailContainer: {
        //padding: 10,
        justifyContent:'center',
        alignItems:'center',
        // borderWidth:1,
        // borderColor:'black',
        marginLeft:Dimensions.get('window').width*0.1,
        //borderRadius:Dimensions.get('window').width*0.1,
        width:Dimensions.get('window').width*0.1,
        height:Dimensions.get('window').width*0.1,
        // width:25,
        // height:25,

        elevation:8,
        shadowColor: 'grey',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: {
          height: 1,
          width: 0
        },
    },

    contentContainer : {
        // //flexDirection: 'column',
        // flex: 2,
        // //justifyContent: 'space-between',
        marginLeft:Dimensions.get('window').width*0.1,
        // marginBottom:20,
        // padding: 10,
        justifyContent:'center',
        alignItems:'center',
        // borderWidth:5,
        // borderColor:'black',
        
    },

    rightSideIconsContainer : {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
        // borderWidth:5,
        // borderColor:'black',
        alignItems:'center',
        //backgroundColor:Colors.secondary
    },

    titleStyle: {
        fontWeight: '200',
        fontSize:20,
        fontFamily: 'nunito-SemiBold',

    },
    descriptionStyle :{
        flexWrap: 'wrap',
    },
    priceStyle:{
        fontWeight:'900',
        fontSize:20,
        
    }
}


export default ChatCard;