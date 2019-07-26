import React, {Component} from 'react';
import { ScrollView, StyleSheet,View,Image,Text,TouchableHighlight,Dimensions} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import MainButton from "../../components/theme/MainButton"; //components\theme\MainButton.js
import Colors from "../../constants/Colors.js";
import firebase from '../../Firebase.js';
import { Item,Button,Badge} from "native-base";
import SmallButtonComponent from '../../components/theme/SmallButtonComponent.js';

export class AccountInfo extends Component {
  constructor(props){
    super(props);
//      this.ref = firebase.firestore().collection('Users').doc('K3xLrQT1OrFirfNXfkYf');
//    this.state = {
//      data: {},
//      name:'',
//      globalAddress:'',
//    } 
//    this.ref.onSnapshot(doc => {
//      this.setState({
//      data: doc.data(),
//      name:doc.data().FirstName + ' ' + doc.data().LastName,
//      globalAddress:doc.data().ExtraAddresses[0] + ', ' + doc.data().ExtraAddresses[1],
//      }); 
// });
  }

render(){
    return (

        <View style={styles.screen}> 

            <View style={styles.pictureHolder}>                  
              <View style={styles.imageView}>
                <Image source={{uri:'https://cdn.pixabay.com/photo/2016/10/26/22/00/hamster-1772742_960_720.jpg'}} style={styles.profilePicture}/>
              </View>               
              <View style={styles.settingsButton}>
                <Button icon transparent>
                  <FontAwesome name='cog' size={35} color={Colors.primary}/>                    
                </Button>
              </View>            
            </View>
                            
            <View style={styles.infoHolder}>
              <View style={styles.nameHolder}>
                <Text style={[styles.title,styles.name]}>Fat Hamster</Text>
              </View>
              <View style={styles.infoBody}>
                <View style={styles.paragrapgh}>
                  <Text style={[styles.title,styles.pickUpTitle]}>Pick Up Location</Text>
                  <Text style={styles.info}>Cookies Ave.</Text>
                  <Text style={styles.info}>Buckingham, United Kingdom</Text>
                </View>                    
              </View>
              <View style={styles.infoBody}>
                <View style={styles.paragrapgh}>
                  <Text style={[styles.title,styles.pickUpTitle]}>Contact Information</Text>
                  <Text style={styles.info}>+1 202 918 7276</Text>
                  <Text style={styles.info}>fat_hamster@cargo.com</Text>
                </View>                    
              </View>
            </View>                

            <View style={[styles.buttons,styles.marginBottom]}>
              <View style={styles.prodInfoButtons}>
                <Button full large primary rounded>
                  <Text style={[styles.buttonText,{color:'white'}]}>Listing</Text>
                </Button>
              </View>
              <View style={styles.prodInfoButtons}>
                <Button full  large primary rounded>
                  <Text style={[styles.buttonText,{color:'white'}]}>Bought</Text>
                </Button>
              </View>
              <View style={styles.prodInfoButtons}>
                <Button full large primary rounded>
                  <Text style={[styles.buttonText,{color:'white'}]}>Sold</Text>
                </Button>
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
},

pictureHolder:{          
  flex: 2.8,
  marginTop:Dimensions.get('window').height * 0.00,
  backgroundColor:Colors.secondary,
  flexDirection:'row',
  justifyContent:'flex-end',      
  shadowColor: '#ddd',
  shadowOpacity: 0.7,
  shadowOffset: {
  width: 2,
  height: 2,
},         
},

settingsButton:{
  flexDirection:'row',
  justifyContent:'flex-start',
  width:Dimensions.get('window').width*0.078,      
  marginRight:Dimensions.get('window').width*0.05,
  marginTop:Dimensions.get('window').height*0.02,       
  shadowColor: 'black',
  shadowOpacity: 0.2,      
  shadowOffset: {
  width: 0,
  height: 2
},              
},
imageView:{      
  alignSelf:'center',      
  marginRight:Dimensions.get('window').width*((0.5+0.16) - 0.448),           
},

profilePicture:{
  width:Dimensions.get('window').width * 0.32,
  height:Dimensions.get('window').width*0.32,
  borderRadius:Dimensions.get('window').width*0.16,         
},

infoHolder:{
  flex:7.2,
  marginLeft:Dimensions.get('window').width*0.05,
  justifyContent:'space-evenly',
},

nameHolder:{
  justifyContent:'center',      
},

title:{
  fontWeight:'700',
  fontSize:30,
},

name:{
  color:'grey',
  margin:Dimensions.get('window').width*0.02,
},

infoBody:{    
  justifyContent:'space-evenly',
  borderRadius:10,
  marginRight:Dimensions.get('window').width*0.05,
  backgroundColor:'white',
  shadowColor: 'black',
  shadowOpacity: 0.2,      
  shadowOffset: {
  width: 0,
  height: 2
  },       
 },

 paragrapgh:{
   margin:Dimensions.get('window').width*0.02,
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
  justifyContent:'space-evenly',
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
  marginHorizontal:Dimensions.get('window').width*0.01,
},
marginBottom:{
  marginVertical:Dimensions.get('window').height*0.01,
},
})