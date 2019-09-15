import React, {Component} from 'react';
import { ScrollView, StyleSheet,View,Image,Text,TouchableHighlight,Dimensions,ImageBackground,TextInput,KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import MainButton from "../../components/theme/MainButton"; //components\theme\MainButton.js
import Colors from "../../constants/Colors.js";
import firebase from '../../Firebase.js';
import { Item,Button,Badge} from "native-base";
import SmallButtonComponent from '../../components/theme/SmallButtonComponent.js';
import Header from './../../components/headerComponents/Header';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import { TouchableOpacity } from 'react-native-gesture-handler';


let storageRef;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
 );

export default class AccountScreen extends React.Component {

  constructor(props){
    super(props);
    storageRef = firebase.storage().ref();
    this.state = {
    data: {},
    name:'',
    globalAddress:'',
    User:null,
    userID:'',
    editMode:false,
    newData:[],
     newPicture:[],
     picture:'',
     currentFolio:'',
     Address:'',
     UnitNumber:'',
    }

    //checking the current user and setting uid
    let user = firebase.auth().currentUser;


    if (user != null) {

      //firebase.auth().signInWithEmailAndPassword(email, password)
        
      this.state.userID = user.uid;
      console.log(" State UID: " + this.state.userID);
      this.ref = firebase.firestore().collection('Users').doc(this.state.userID);
      this.ref.get().then(doc => {
        this.setState({
        data: doc.data(),
        name:doc.data().FirstName,
        //globalAddress:doc.data().City + ', ' + doc.data().Country,
        UnitNumber:doc.data().UnitNumber,
        Address:doc.data().Address,
        Email:doc.data().Email,
        PhoneNumber:doc.data().PhoneNumber,
        picture:doc.data().ProfilePicture,
        }); 
      }); 
    
    //firestore reference for the specific document associated with the user
    this.ref = firebase.firestore().collection('Users').doc(this.state.userID);

  }
    
}

componentDidMount() {
  const { navigation } = this.props;
    
    this.focusListener = navigation.addListener('didFocus', () => { 
    //checking the current user and setting uid
    let user = firebase.auth().currentUser;

    if (user != null) {

      //firebase.auth().signInWithEmailAndPassword(email, password)
        
      this.state.userID = user.uid;
      console.log(" State UID: " + this.state.userID);
      this.ref = firebase.firestore().collection('Users').doc(this.state.userID);
      this.ref.get().then(doc => {
        this.setState({
        data: doc.data(),
        name:doc.data().FirstName,
        //globalAddress:doc.data().City + ', ' + doc.data().Country,
        UnitNumber:doc.data().UnitNumber,
        Address:doc.data().Address,
        Email:doc.data().Email,
        PhoneNumber:doc.data().PhoneNumber,
        picture:doc.data().ProfilePicture,
        }); 
      }); 
    
         
      
  
    
    //firestore reference for the specific document associated with the user
    this.ref = firebase.firestore().collection('Users').doc(this.state.userID);

  }
      
  });

  this.getPermissionAsync();
  // List to the authentication state
  this._unsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
}

componentWillUnmount() {
  // Clean up: remove the listener

  console.log('COMPonenet mount----')
  this._unsubscribe();
}

onAuthStateChanged = user => {
  // if the user logs in or out, this will be called and the state will update.
  // This value can also be accessed via: firebase.auth().currentUser
  this.setState({ User: user });
};  

  //Function to logo out user21`22122
  async logoutAsync() {
    try {
      await firebase.auth().signOut();
      props.navigation.navigate('Account');
    } catch ({ message }) {
      alert('You are logged out!!');
    }
  }


  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };
  onSignIn = googleUser => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebase
            .auth()
            .signInAndRetrieveDataWithCredential(credential)
            .then(result => {
              console.log('user signed in ');
              if (result.additionalUserInfo.isNewUser) {
                firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .set({
                    gmail: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    created_at: Date.now()
                  })
                  .then(function(snapshot) {
                    // console.log('Snapshot', snapshot);
                  });
              } else {
                firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .update({
                    last_logged_in: Date.now()
                  });
              }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
        } else {
          console.log('User already signed-in Firebase.');
        }
      }.bind(this)
    );
  };
  signInWithGoogleAsync = async () => {
    try {
      const result = await Expo.Google.logInAsync({
        // androidClientId: YOUR_CLIENT_ID_HERE,
        behavior: 'web',
        iosClientId: '', //enter ios client id
        scopes: ['profile', 'email']
      });
      if (result.type === 'success') {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  goToEditMode =() =>{
    let info = this.state.data;
    this.setState({
      editMode:true,
      //newData:[info.FirstName,info.LastName,info.Street,info.City,info.Country,info.Email,info.PhoneNumber],
      newPicture:[info.ProfilePicture],
      currentFolio:info.ProfilePicture,
    })
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

        that.setState({
          picture:downloadURL,
        })

        that.setPicture();
      });

      
    }
    );
    
    

    return 'Success';
  };

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
      ProfilePicture:this.state.picture,

      });
    this.setState({
      newPicture:newArray,
    })
    }
  }


  //Function to choose an image for your profile picture
  chooseanImage = async () =>{

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,      
    });

    this.setState({
      newPicture:[this.state.data.ProfilePicture],
    });

    if(!result.cancelled){
      console.log(result.uri);   
    
    await this.uploadImageToFirebase(result.uri, uuid.v1())
        .then(() => {
          console.log('Success' + uuid.v1());
            
        })
        .catch(error => {
          console.log('Success' + uuid.v1()); 
          console.log(error);
        });
      }
  }

  changeCurrentFolio =()=>{
    console.log('changing folio');
    if(this.state.newPicture.length==2){
      this.setState({
        currentFolio:this.state.newPicture[1],
        
      })
    }
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


  

  inputText =(num) =>{
    if(num==0 || num==1){
      return(
        <TextInput
        style={[styles.inputName]}                
          editable={true}
          value={this.state.name}
          onChangeText={(value) =>  {this.setState({name:value})}}
          keyboardType='default'
          autoCorrect={false}
          maxLength={20}
          placeholder ='Full name'                                                            
        />
      )
    }
    else if(num == 6){
      return(<TextInput
        style={[styles.inputInfo]}                
          editable={true}
          value={this.state.PhoneNumber}
          onChangeText={ (value) => {this.setState({PhoneNumber:value})}}
          keyboardType='phone-pad'
          autoCorrect={false}
          placeholder= 'phone number'
          maxLength ={10}                                                            
        />);      
    }
    else 
      if(num==2){
        return(<TextInput
        style={[styles.inputInfo]}                
          editable={true}
          value={this.state.UnitNumber}
          onChangeText={ (value) => {this.setState({UnitNumber:value})}}
          keyboardType='number-pad'
          autoCorrect={false}
          placeholder='Unit Number'
          maxLength={8}                                                            
        />);   
      }
      // else 
      //   if(num==3){
      //     return(<TextInput
      //       style={[styles.inputInfo]}                
      //         editable={true}
      //         value={this.state.Address}
      //         onChangeText={ (value) => {this.setState({Address:value})}}
      //         keyboardType='default'
      //         autoCorrect={false}
      //         placeholder='City'                                                            
      //       />);          
      //   }
        else 
        if(num==4){
          return(<TextInput
            style={[styles.inputInfo]}                
              editable={true}
              value={this.state.Address}
              onChangeText={ (value) => {this.setState({Address:value})}}
              keyboardType='default'
              autoCorrect={false}
              placeholder='Address'                                                          
            />);          
        }
      //   else{
      //   return(<TextInput
      //     style={[styles.inputInfo]}                
      //       editable={true}
      //       value={}
      //       onChangeText={ (value) => {}}
      //       keyboardType='decimal-pad'
      //       autoCorrect={false}
      //       defaultValue='Street #'                                                            
      //     />); 
      // }
               
        
  }

  // changeValue =(value,number) =>{
  //   const copy = this.state.newData;
  //   copy[number]=value
  //   this.setState({
  //     newData:copy,
  //   })
  // }


  //Function that is called when the save button is clicked
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
      FirstName:this.state.name,
      //LastName:this.state.newData[1],
      Address:this.state.Address,
      UnitNumber:this.state.UnitNumber,
      //Email:this.state.Email,
      PhoneNumber:this.state.PhoneNumber,	
      ProfilePicture:this.state.picture,
      });
    this.setState({
      editMode:false,
      newPicture:newArray,
    })
  }

    showDefaultPhoneNum =()=>{
      if(this.state.PhoneNumber ==''){
        return 'no phone number'
          
        
      }
      else{
        return this.state.PhoneNumber
      }
    }

  render() {
    const {navigate} = this.props.navigation;
    if(this.state.User != null){

      if(this.state.editMode){
        console.log('editing');
        return (
          <DismissKeyboard>

          <View style={styles.screen}> 

              <View style={styles.pictureHolder}>                  
                <View style={styles.imageView}>
                <ImageBackground source={{uri:this.state.currentFolio}} ImageStyle={[styles.ProfilePicture,{borderRadius:25}]} style={styles.profileBackground}>
                      <View style={{position:'absolute', alignSelf:'flex-end',bottom:0,justifyContent:'center',alignItems:'center'}}>
                        <Button icon  transparent  onPress={this.chooseanImage}> 
                          <FontAwesome name='camera' size={35} color={Colors.primary}/>                    
                        </Button>
                      </View>
                      </ImageBackground>
                </View>               
                {/* <View style={styles.settingsButton}>
                  <Button icon transparent>
                    <FontAwesome name='cog' size={35} color={Colors.primary}/>                    
                  </Button>

                  <Button transparent> 
                    <Text style={[styles.buttonText,{color:'white'}]}>Edit</Text>
                  </Button>
                </View>             */}
              </View>
                              
              <KeyboardAvoidingView style={styles.infoHolder} behavior="padding" enabled>
                    <View style={styles.nameHolder}>
                    <View style={{flexDirection:'row'}}>
                      {this.inputText(0)}
                      {/* {this.inputText(1)} */}
                    </View>
                      
                    </View>
                    <View style={styles.infoBody}>
                      <View style={styles.paragrapgh}>
                        <Text style={[styles.title,styles.pickUpTitle]}>Pick Up Location</Text>
                        <View style={{flexDirection:'row'}}>
                          {this.inputText(2)}                        
                        </View>
                          {this.inputText(4)}                                                
                      </View>                    
                    </View>
                    <View style={styles.infoBody}>
                      <View style={styles.paragrapgh}>
                        <Text style={[styles.title,styles.pickUpTitle]}>Contact Information</Text>                        
                        {this.inputText(6)}
                        <Text style={styles.info}>{this.state.Email}</Text>
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
          </DismissKeyboard>

      );

      }
      else{
        console.log('User is logged in, showing the user information');
        return (
          <View style={styles.screen}> 

              <View style={styles.pictureHolder}>                  
                <View style={styles.imageView}>
                  <Image source={{uri:this.state.picture}} style={styles.profilePicture}/>
                </View>
              </View>
                              
              <View style={styles.infoHolder}>
                <View style={[styles.settingsButton,{flexDirection:'row',justifyContent:'space-around'}]}>
                    <TouchableOpacity onPress={this.goToEditMode}>
                      <MainButton title='Edit' secondary="true" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.logoutAsync}>
                      <MainButton title='LogOut' secondary="true" />
                    </TouchableOpacity>                  
                </View>
                <View style={styles.nameHolder}>
                  <Text style={[styles.title,styles.name]}>{this.state.name}</Text>
                </View>
                <View style={styles.infoBody}>
                  <View style={styles.paragrapgh}>
                    <Text style={[styles.title,styles.pickUpTitle]}>Pick Up Location</Text>
                    <Text style={styles.info}>Unit Number : {this.state.UnitNumber}</Text>
                    <Text style={styles.info}>{this.state.Address}</Text>                    
                  </View>                    
                </View>
                <View style={styles.infoBody}>
                  <View style={styles.paragrapgh}>
                    <Text style={[styles.title,styles.pickUpTitle]}>Contact Information</Text>
                    <Text style={styles.info}>{this.showDefaultPhoneNum()}</Text>                   
                    <Text style={styles.info}>{this.state.Email}
                    {this.showDefaultPhoneNum()}
                    </Text>
                  </View>                    
                </View>
              </View>                

              <View style={[styles.buttons,styles.marginBottom]}>
                <View style={styles.prodInfoButtons}>
                  <Button full large primary rounded onPress={() => navigate('Listing', {id:this.state.userID})}>
                    <Text style={[styles.buttonText,{color:'white'}]}>Listing</Text>
                  </Button>
                </View>
                <View style={styles.prodInfoButtons}>
                  <Button full  large primary rounded onPress={() => navigate('Bought', {id:this.state.userID})}>
                    <Text style={[styles.buttonText,{color:'white'}]}>Bought</Text>
                  </Button>
                </View>
                <View style={styles.prodInfoButtons}>
                  <Button full large primary rounded onPress={() => navigate('Sold', {id:this.state.userID})}>
                    <Text style={[styles.buttonText,{color:'white'}]}>Sold</Text>
                  </Button>
                </View>
              </View>

          </View>
      );

      }
        
    }
    else{
      console.log('User not logged in');
        return (
            <View style={styles.viewStyle}>
              <View style={styles.logoStyle}>
                <Image
                style={{width: 300, height: 300, borderRadius:20}}
                source={require('../../assets/images/icon.png')}
              />
              </View>

             <View style={styles.buttonsWithLogo}>
               <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp', {prevPage: 'Login'})}>
                <MainButton title='Login'/>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp', {prevPage: 'SignUp'})}>
                <MainButton title='SignUp'/>
              </TouchableOpacity>
            </View> 
              
            </View>
           
        );
      }
  }
}
const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
//    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
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
    justifyContent:'center',      
    shadowColor: '#ddd',
    shadowOpacity: 0.7,
    shadowOffset: {
    width: 2,
    height: 2,
  },         
  },
  
  settingsButton:{
    //flexDirection:'column',
    //justifyContent:'flex-start',
    //alignSelf:'flex-end',
    //width:Dimensions.get('window').width*0.078,      
    //marginRight:Dimensions.get('window').width*0.05,
    //marginTop:Dimensions.get('window').height*0.02,       
    shadowColor: 'black',
    shadowOpacity: 0.2,      
    shadowOffset: {
    width: 0,
    height: 2
  },              
  },
  imageView:{      
    alignSelf:'center',
    marginTop:20,      
    //marginRight:Dimensions.get('window').width*((0.5+0.16) - 0.448),           
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
  profileBackground:
{
  width:Dimensions.get('window').width *0.32,
  height:Dimensions.get('window').width*0.32,
},
logoStyle:{
  flex:0.7,
  
  justifyContent:'center',

},
buttonsWithLogo:{
  flex:0.3,
  
  justifyContent:'center',
},
})
