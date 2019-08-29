import React, {Component} from 'react';
import { ScrollView, StyleSheet,View,Image,Text,TouchableHighlight,Dimensions,ImageBackground,TextInput,KeyboardAvoidingView,TouchableWithoutFeedback} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import MainButton from "../../components/theme/MainButton"; //components\theme\MainButton.js
import Colors from "../../constants/Colors.js";
import firebase from '../../Firebase.js';
import { Item,Button,Badge} from "native-base";
import SmallButtonComponent from '../../components/theme/SmallButtonComponent.js';
import { Overlay } from 'react-native-elements';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
// import uuid from 'react-native-uuid';



let storageRef;
export default class AccountInfo extends Component {

  

  constructor(props){
    super(props);
     this.ref = firebase.firestore().collection('Users').doc('rh1cFdoEdRUROJP36Ulm');
     storageRef = firebase.storage().ref();
   this.state = {
     userId:'rh1cFdoEdRUROJP36Ulm',
     data: {},
     name:'',
     globalAddress:'',
     secondNumber:null,
     

     editMode:false,
     newData:[],
     newPicture:[],
     currentFolio:'',     
   }
   
   

   this.ref.onSnapshot(doc => {
     this.setState({
     data: doc.data(),
     name:doc.data().FirstName + ' ' + doc.data().LastName,
     globalAddress:doc.data().City + ', ' + doc.data().Country,
     }); 
    });
  }


  componentDidMount() {
    this.getPermissionAsync();
    console.log('component did mount');
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      console.log('ask permission');
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  chooseanImage = async () =>{

    this.setState({
      newPicture:[this.state.data.ProfilePicture],
    })

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3]
    });

    if(!result.cancelled){
      console.log(result.uri);
    }
    await this.uploadImageToFirebase(result.uri, uuid.v1())
        .then(() => {
          console.log('Success' + uuid.v1());
            
        })
        .catch(error => {
          console.log('Success' + uuid.v1()); 
          console.log(error);
        });
  }


  uploadImageToFirebase = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    console.log('INside upload Image to Firebase')
    var uploadTask = storageRef.child('images/'+uuid.v1()).put(blob);
    const that = this;
    
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function(snapshot){
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {
      // Handle unsuccessful uploads
    }, function() {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
        that.state.newPicture.push(downloadURL);
        
        that.changeCurrentFolio();

        that.setPicture();
      });

      
    }
    );
    
    

    return 'Success';
  };
// this is a function to change the current look of the profile 
  changeCurrentFolio =()=>{
    console.log('changing folio');
    if(this.state.newPicture.length==2){
      this.setState({
        currentFolio:this.state.newPicture[1],
        
      })
    }
  }
// the function to set ecverything for the change mode
  goToEdit =() =>{
    console.log('Hello')
    let info = this.state.data;

    this.setState({
      editMode:true,
      newData:[info.FirstName,info.LastName,info.Street,info.City,info.Country,info.Email,info.PhoneNumber],
      newPicture:[info.ProfilePicture],
      currentFolio:info.ProfilePicture,
    });
    console.log('End of Hello')
  }


  

  saveChanges =() =>{
    
    let pictureTemp='';
    let newArray =[];
    console.log(this.state.newPicture.length);

    if(this.state.newPicture.length==2){
      pictureTemp=this.state.newPicture[1];
    }
    else{
      pictureTemp=this.state.newPicture[0];
    }

    this.ref.update({
      FirstName:this.state.newData[0],
      LastName:this.state.newData[1],
      Street:this.state.newData[2],
      City:this.state.newData[3],
      Country:this.state.newData[4],
      Email:this.state.newData[5],
      PhoneNumber:this.state.newData[6],	
      ProfilePicture:pictureTemp,
      });
    this.setState({
      editMode:false,
      newPicture:newArray,
    })
  }

  setPicture =() =>{
    if(!this.state.editMode){
      
    let pictureTemp='';
    let newArray =[];
    console.log(this.state.newPicture.length);

    if(this.state.newPicture.length==2){
      pictureTemp=this.state.newPicture[1];
    }
    else{
      pictureTemp=this.state.newPicture[0];
    }

    this.ref.update({
      ProfilePicture:pictureTemp,
      });
    this.setState({
      newPicture:newArray,
    })
    }
  }

  inputText =(num) =>{
    if(num==0 || num==1){
      return(
        <TextInput
        style={[styles.inputName]}                
          editable={true}
          value={this.state.newData[num]}
          onChangeText={ (value) => {this.changeValue(value,num)}}
          keyboardType='default'
          autoCorrect={false}                                                            
        />
      )
    }
    else if(num == 5){
      return(<TextInput
        style={[styles.inputInfo]}                
          editable={true}
          value={this.state.newData[num]}
          onChangeText={ (value) => {this.changeValue(value,num)}}
          keyboardType='email-address'
          autoCorrect={false}                                                            
        />);      
    }
    else {
      return(<TextInput
        style={[styles.inputInfo]}                
          editable={true}
          value={this.state.newData[num]}
          onChangeText={ (value) => {this.changeValue(value,num)}}
          keyboardType='name-phone-pad'
          autoCorrect={false}                                                            
        />);            
    }    
  }
  showSecondNumber =() =>{
    if(this.state.secondNumber){
      return(
        <View>
        <Text style={styles.info}>{this.state.data.PhoneNumber}</Text>
        <Text style={styles.info}>{this.state.secondNumber}</Text>
        </View>
        
      );
    }
    else{
      return(
          <View>
        <Text style={styles.info}>{this.state.data.PhoneNumber}</Text>
      </View>
      )
            
    }
  }

  changeValue =(value,number) =>{
    const copy = this.state.newData;
    copy[number]=value
    this.setState({
      newData:copy,
    })
  }

  async logoutAsync(props) {
    try {
      await firebase.auth().signOut();
      props.navigation.navigate('Account');
    
    } catch ({ message }) {
      alert(message);
    }
  }

render(){
  const {navigate} = this.props.navigation;

            if(this.state.editMode){
                return(

                  

                  <View style={styles.screen} > 
      
                  <View style={styles.pictureHolder}>                  
                    <View style={styles.imageView}>
                      <ImageBackground source={{uri:this.state.currentFolio}} ImageStyle={styles.ProfilePicture} style={styles.profileBackground}>
                      <View style={{position:'absolute', alignSelf:'flex-end',bottom:0,justifyContent:'center',alignItems:'center'}}>
                        <Button icon transparent onPress={this.chooseanImage}> 
                          <FontAwesome name='camera' size={35} color={Colors.primary}/>                    
                        </Button>
                      </View>
                      </ImageBackground>
                    </View>               
                    <View style={styles.settingsButton}>

                      <Button icon transparent disabled>
                        <FontAwesome name='cog' size={35} color='grey'/>                    
                      </Button>
                    </View>            
                  </View>


                   
                   <KeyboardAvoidingView style={styles.infoHolder} behavior="padding" enabled>
                    <View style={styles.nameHolder}>
                    <View style={{flexDirection:'row'}}>
                      {this.inputText(0)}
                      {this.inputText(1)}
                    </View>
                      
                    </View>
                    <View style={styles.infoBody}>
                      <View style={styles.paragrapgh}>
                        <Text style={[styles.title,styles.pickUpTitle]}>Pick Up Location</Text>
                        <View style={{flexDirection:'row'}}>
                          {this.inputText(2)}
                          {this.inputText(3)}                          
                        </View>
                          {this.inputText(4)}                                                
                      </View>                    
                    </View>
                    <View style={styles.infoBody}>
                      <View style={styles.paragrapgh}>
                        <Text style={[styles.title,styles.pickUpTitle]}>Contact Information</Text>
                        {this.inputText(5)}
                        {this.inputText(6)}
                      </View>                    
                    </View>
                  </KeyboardAvoidingView>


                  <View style={[styles.buttons,styles.marginBottom]}>
                    <View style={styles.prodInfoButtons}>
                      <Button full large primary rounded onPress={this.saveChanges}>
                        <Text style={[styles.buttonText,{color:'white'}]}>Save</Text>
                      </Button>
                    </View>
                  </View>
      
              </View>  
                );
            }
            else{
              return (

                <View style={styles.screen}> 
      
                  <View style={styles.pictureHolder}>                  
                    <View style={styles.imageView}>
                      <Image source={{uri:this.state.data.ProfilePicture}} style={styles.profilePicture}/>
                    </View>               
                    <View style={styles.settingsButton}>
                      <Button icon transparent onPress={this.goToEdit}>
                        <FontAwesome name='cog' size={35} color={Colors.primary}/>                    
                      </Button>
                    </View>            
                  </View>
                                  
                  <View style={styles.infoHolder}>
                    <View style={styles.nameHolder}>
                      <Text style={[styles.title,styles.name]}>{this.state.name}</Text>
                    </View>
                    <View style={styles.infoBody}>
                      <View style={styles.paragrapgh}>
                        <Text style={[styles.title,styles.pickUpTitle]}>Pick Up Location</Text>
                        <Text style={styles.info}>{this.state.data.Street}</Text>
                        <Text style={styles.info}>{this.state.globalAddress}</Text>
                      </View>                    
                    </View>
                    <View style={styles.infoBody}>
                      <View style={styles.paragrapgh}>
                        <Text style={[styles.title,styles.pickUpTitle]}>Contact Information</Text>                        
                        <Text style={styles.info}>{this.state.data.Email}</Text>
                        {this.showSecondNumber()}                        
                      </View>                    
                    </View>
                  </View>                
      
                  <View style={[styles.buttons,styles.marginBottom]}>
                    <View style={styles.prodInfoButtons}>
                      <Button full large primary rounded onPress={() => navigate('Listing', {id:this.state.userId})}>
                        <Text style={[styles.buttonText,{color:'white'}]}>Listing</Text>
                      </Button>
                    </View>
                    <View style={styles.prodInfoButtons}>
                      <Button full  large primary rounded onPress={() => navigate('Bought', {id:this.state.userId})} >
                        <Text style={[styles.buttonText,{color:'white'}]}>Bought</Text>
                      </Button>
                    </View>
                    <View style={styles.prodInfoButtons}>
                      <Button full large primary rounded onPress={() => navigate('Sold', {id:this.state.userId})}>
                        <Text style={[styles.buttonText,{color:'white'}]}>Sold</Text>
                      </Button>
                    </View>
                    <View style={styles.prodInfoButtons}>
                      <Button full large primary rounded onPress={this.logoutAsync}>
                        <Text style={[styles.buttonText,{color:'white'}]}>Log Out</Text>
                      </Button>
                    </View>
                  </View>
      
              </View>
            );
            }
   
}


}

const styles = {
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

profileBackground:
{
  width:Dimensions.get('window').width *0.32,
  height:Dimensions.get('window').width*0.32,
},

infoHolder:{
  flex:7.2,
  marginLeft:Dimensions.get('window').width*0.05,
  justifyContent:'space-evenly',
},

inputText:{
  marginVertical:Dimensions.get('window').height*0.05,
  borderBottomColor:Colors.primary,
  borderBottomWidth:1,
  width:Dimensions.get('window').width*0.8,
},

inputName:{
  textAlign:'left',
  justifyContent:'center',
  padding:5,
  fontSize:30,
  fontWeight:'700',
  color:'grey',
  margin:Dimensions.get('window').width*0.02,
  borderBottomColor:Colors.primary,
  borderBottomWidth:1,
},

inputInfo:{
  textAlign:'left',
  justifyContent:'center',
  padding:5,
  fontSize:18,
  fontWeight:'500',
  color:'grey',
  margin:Dimensions.get('window').width*0.02,
  borderBottomColor:Colors.primary,
  borderBottomWidth:1,  
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
}