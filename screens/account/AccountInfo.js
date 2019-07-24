import React, {Component} from 'react';
import { ScrollView, StyleSheet,View,Image,Text,TouchableHighlight,Dimensions} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import MainButton from "../../components/theme/MainButton"; //components\theme\MainButton.js
import Colors from "../../constants/Colors.js";
import firebase from '../../Firebase.js';
import { Item,Button } from "native-base";
import SmallButtonComponent from '../../components/theme/SmallButtonComponent.js';

export class AccountInfo extends Component {
    constructor(props){
        super(props);
         this.ref = firebase.firestore().collection('Users').doc('K3xLrQT1OrFirfNXfkYf');
       this.state = {
         data: {},
         name:'',
         globalAddress:'',
       } 
       this.ref.onSnapshot(doc => {
         this.setState({
         data: doc.data(),
         name:doc.data().FirstName + ' ' + doc.data().LastName,
         globalAddress:doc.data().ExtraAddresses[0] + ', ' + doc.data().ExtraAddresses[1],
         }); 
    });
      }
    
    render(){
        return (
    
            <View style={styles.screen}>
    
    
            
            
                <View style={styles.pictureHolder}>
                    <Image source={{uri:this.state.data.ProfilePicture}} style={styles.profilePicture}/>
                </View>
                <View style={styles.headbuttons}>
            <View style={{flex:1}}>
                  <View>
                  <Button  full primary   >
                  <FontAwesome name='cogs' size={30} color='white'/>
                    <Text style={[styles.buttonText,{color:'white'}]}>  Account Settings</Text></Button>
                  </View>
                  {/* <View style={styles.button}>
                  <Button    full  rounded light><Text style={[styles.buttonText,{color:'orange'}]}>LogOut</Text></Button>
                  </View> */}
                </View>
            </View>
                <View style={styles.infoHolder}>
                <View style={styles.nameHolder}>
                  <Text style={[styles.title,styles.name]}>{this.state.name}</Text>
                </View>
                <View style={styles.infoBody}>
                <Text style={[styles.title,styles.pickUpTitle]}>Pick Up Location</Text>
                <Text style={styles.info}>{this.state.data.Address}</Text>
                <Text style={styles.info}>{this.state.globalAddress}</Text>
                </View>
                <View style={styles.infoBody}>
                <Text style={[styles.title,styles.pickUpTitle]}>Contact Information</Text>
                  <Text style={styles.info}>{this.state.data.PhoneNumber}</Text>
                  <Text style={styles.info}>{this.state.data.Email}</Text>
                </View>
                </View>
                
    
                <View style={[styles.buttons,{marginTop:5}]}>
                  <View style={styles.prodInfoButtons}>
                  <Button full large danger><Text style={[styles.buttonText,{color:'white'}]}>Listing</Text></Button>
                  </View>
                  <View style={styles.prodInfoButtons}>
                  <Button full  large success><Text style={[styles.buttonText,{color:'white'}]}>Bought</Text></Button>
                  </View>
                  <View style={styles.prodInfoButtons}>
                  <Button full large info><Text style={[styles.buttonText,{color:'white'}]}>Sold</Text></Button>
                  </View>
                  </View>
            </View>
        );
    }
    
    
    }
    
    const styles = StyleSheet.create({
    screen:{
    flex:10,
    },
    headbuttons:{
      flex:1,
     // marginTop:Dimensions.get('window').height * 0.04,
    //   borderColor:'black',
    // borderWidth: 0.5,
    },
    pictureHolder:{
    alignItems:'center',
    justifyContent:'center',
    flex: 2.8,
    marginTop:Dimensions.get('window').height * 0.00,
    // borderColor:'black',
    // borderWidth: 0.5,
    backgroundColor:Colors.secondary,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    },
    profilePicture:{
    width:Dimensions.get('window').width * 0.32,
    height:Dimensions.get('window').width*0.32,
    borderRadius:Dimensions.get('window').width*0.16,
    
    },
    infoHolder:{
      flex:6.2,
      marginLeft:Dimensions.get('window').width*0.05,
      justifyContent:'space-evenly',
      
      // borderColor:'black',
      // borderWidth: 0.5,
    },
    nameHolder:{
    //  borderColor:'black',
    // borderWidth: 0.5,
      justifyContent:'center',
      
    },
    title:{
      fontWeight:'700',
      fontSize:30,
    },
    name:{
      color:'grey',
    },
    
    infoBody:{
    
      justifyContent:'space-evenly',
     
    },
    pickUpTitle:{
    color:'black',
    },
    info:{
      marginTop:Dimensions.get('window').height*0.03,
      fontWeight:'500',
      color:'grey',
      fontSize:18,
    },
    buttons:{
      flex:1,
      flexDirection:'row',
    
    },
        button:{
          flex:0.48,
          marginLeft:Dimensions.get('window').width*0.05,
          marginRight:Dimensions.get('window').width*0.05,
          alignItems:'center',
        },
        buttonText:{
          fontSize:Dimensions.get('window').width*0.06,
        },
        
        prodInfoButtons:{
          flex:Dimensions.get('window').width/3.5,
        },
    })