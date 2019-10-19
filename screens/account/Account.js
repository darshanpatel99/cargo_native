import React, {Component} from 'react';
import { StyleSheet,View,Dimensions, Image, ImageBackground,TextInput,KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native';
import Colors from "../../constants/Colors.js";
import firebase from '../../Firebase.js';
import { Button, Text} from "native-base";
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { FontAwesome} from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";


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
    //this.ref = firebase.firestore().collection('Users').doc(this.state.userID);

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

  // List to the authentication state
  this._unsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
}

componentWillUnmount() {
  // Clean up: remove the listener

  console.log('COMPonenet mount----')
  this._unsubscribe();
  this.focusListener.remove();
}

onAuthStateChanged = (user) => {
  // if the user logs in or out, this will be called and the state will update.
  // This value can also be accessed via: firebase.auth().currentUser
  if (user != null){
    if(user.emailVerified){ // note difference on this line
      this.setState({ User: user});
    }
  }
  else{
    this.setState({ User: null});
  }
};  

  //Function to logo out user21`22122
  async logoutAsync() {
    try {
      await firebase.auth().signOut();
      //props.navigation.navigate('Home');
      // const { navigate } = this.props.navigation;
      // navigate('ChatScreen')
    } catch ({ message }) {
      //alert('You are logged out!!');
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
    let tempFolio = '';

    if(this.state.picture == ''){
      tempFolio = require('../../assets/images/user.png')
    }
    else {
      tempFolio = {uri:this.state.picture};
    }
    this.setState({
      editMode:true,
      newPicture:[info.ProfilePicture],
      currentFolio:tempFolio,
    })
  }

  uploadImageToFirebase = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    console.log('Inside upload Image to Firebase')
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

    if (Constants.platform.ios) {
      console.log('ask permission');
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      const { cameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality:0.1,      
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
        currentFolio:{uri:this.state.newPicture[1]},
        
      })
    }
  }


  inputText =(num) =>{
    if(num==0 || num==1){
      return(
        <TextInput
        style={[styles.inputName]}                
          editable={true}
          value={this.state.name}
          onChangeText={(value) =>  {this.setState({name:value})}}
          keyboardType='default'
          returnKeyType='done'
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
          returnKeyType='done'
          autoCorrect={false}
          placeholder= 'phone number'
          maxLength ={12}                                                            
        />);      
    }
    else 
      if(num==2){
        return(<TextInput
        style={[styles.inputInfo]}                
          editable={true}
          value={this.state.UnitNumber}
          onChangeText={ (value) => {this.setState({UnitNumber:value})}}
          //keyboardType='number-pad'
          returnKeyType='done'
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
              returnKeyType='done'
              autoCorrect={false}
              placeholder='Address'
              maxLength={30}                                                          
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
    let profileImage=''

    if(this.state.picture == '') {
      profileImage=require('../../assets/images/user.png')
    }
    else{
      profileImage= {uri:this.state.picture}
    }
    
    if(this.state.User != null){

      if(this.state.editMode){
        console.log('editing');

        return (
          <DismissKeyboard>

          <View style={styles.screen}> 

              <View style={styles.pictureHolder}>                  
                <View style={styles.imageView}>
                <ImageBackground source={this.state.currentFolio} ImageStyle={[styles.ProfilePicture,{borderRadius:25}]} style={styles.profileBackground}>
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
                  <Image source={profileImage} style={styles.profilePicture}/>
                </View>
              </View>

              <View style={[styles.settingsButton,{justifyContent:'center'}]}>
                  <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                
                    <Button light rounded large style={styles.secondaryButton} onPress={this.goToEditMode}>
                      <Text style={styles.secondaryText}>Edit</Text>
                    </Button>

                    <Button light rounded large style={styles.secondaryButton} onPress={this.logoutAsync}>
                      <Text style={styles.secondaryText}>LogOut</Text>
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
                    <Text style={styles.info}>Unit Number : {this.state.UnitNumber}</Text>
                    <Text style={styles.info}>{this.state.Address}</Text>                    
                  </View>                    
                </View>
                <View style={styles.infoBody}>
                  <View style={styles.paragrapgh}>
                    <Text style={[styles.title,styles.pickUpTitle]}>Contact Information</Text>
                    <Text style={styles.info}>{this.showDefaultPhoneNum()}</Text>                   
                    <Text style={styles.info}>{this.state.Email}
                    </Text>
                  </View>                    
                </View>
              </View>                

              <View style={[styles.buttons,styles.marginBottom]}>
                <View style={styles.prodInfoButtons}>
                  <Button  light rounded large style={styles.secondaryBlueButton} onPress={() => navigate('Listing', {id:this.state.userID})}>
                    <Text style={styles.secondaryWhiteText}>Listing</Text>
                  </Button>
                </View>
                <View style={styles.prodInfoButtons}>
                  <Button light rounded large style={styles.secondaryBlueButton} onPress={() => navigate('Bought', {id:this.state.userID})}>
                    <Text style={styles.secondaryWhiteText}>Bought</Text>
                  </Button>
                </View>
                <View style={styles.prodInfoButtons}>
                  <Button light rounded large style={styles.secondaryBlueButton} onPress={() => navigate('Sold', {id:this.state.userID})}>
                    <Text style={styles.secondaryWhiteText}>Sold</Text>
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
          <ImageBackground source={require('../../assets/images/background.jpg')} style={{width: '100%', height: '100%'}}>
            <View style={styles.viewStyle}>
              <View style={styles.logoStyle}>
                <Text
                  style={{
                    fontSize: Dimensions.get('screen').width * 0.18,
                    fontFamily: 'origo',
                    fontWeight: 'bold',
                  }}
                >
                  CarGo
                </Text>

                  <Text style={{
                    fontSize:20,
                    fontFamily: 'nunito-SemiBold',
                    textAlign:'center',
                    marginTop:20,
                  }}>Post, buy, sell and watch as your items are delivered right to your door.</Text>

              </View>

            <View style={styles.bigButton}>

            <Button large-green style={styles.loginbutton} onPress ={this.googleLoginAsync}>
              <Ionicons
                size={30}
                color="#fff"
                style={styles.icon}
                name='logo-google'
              />
              <Text style={styles.lightText}>Continue with Google</Text>
            </Button>

            <Text  style={{
                    fontSize:20,
                    fontFamily: 'nunito-SemiBold',
                    textAlign:'center',
                  }} > Or </Text>

              <Button large-green style={styles.loginbutton} onPress={() => this.props.navigation.navigate('SignUp', {prevPage: 'SignUp'})}>
                <Ionicons
                  size={30}
                  color="#fff"
                  style={styles.icon}
                  name='ios-mail'
                />
                <Text style={styles.lightText}>Continue with Email</Text>
              </Button>

            </View>
          </View>
          </ImageBackground>
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
    flex:12,
  },
  pictureHolder:{          
    flex: 3,
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
    flex:1,
    //flexDirection:'column',
    //justifyContent:'flex-start',
    //alignSelf:'flex-end',
    //width:Dimensions.get('window').width*0.078,      
    //marginRight:Dimensions.get('window').width*0.05,
    //marginTop:Dimensions.get('window').height*0.02,
     elevation:8,      
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
    flex:6,
    marginLeft:Dimensions.get('window').width*0.05,
    justifyContent:'space-evenly',
   // marginVertical:Dimensions.get('window').height*0.01,
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
  loginbutton: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: Dimensions.get('window').width - 80,
    margin: 5,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5
  },

  bigButton: {
    flex: 0.7,
    flexDirection: 'column',
    alignItems:'center',
    justifyContent: 'flex-end',
    marginBottom: 50,
  },

  
  infoBody:{    
    justifyContent:'space-evenly',
    borderRadius:10,
    marginRight:Dimensions.get('window').width*0.05,
    backgroundColor:'white',
    elevation:8,
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
    marginTop:Dimensions.get('window').height*0.01,
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
   // marginVertical:Dimensions.get('window').height*0.01,
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
  flex:0.3,
  justifyContent:'center',
  alignItems:'center',
  marginTop:50,
},
buttonsWithLogo:{
  flex:0.3,
  justifyContent:'center',
},
lightText: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "500",
  letterSpacing: 1.2
},
button: {
  flex: 0,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  height: 50,
  width: 300,
  margin: 5,
  backgroundColor: Colors.primary,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5
},
secondaryButton: {
  flex: 0,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  height:Dimensions.get('window').height*0.065,
  width: Dimensions.get('window').width*0.35,
  margin: 5
},
secondaryText: {
  color: Colors.primary,
  fontSize:Dimensions.get('window').width*0.04,
  fontWeight: "500",
  letterSpacing: 1.2
},

secondaryWhiteText: {
  color: "#fff",
  fontSize: Dimensions.get('window').width*0.04,
  fontWeight: "500",
  letterSpacing: 1.2
},

secondaryBlueButton: {
  flex: 0,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  height: 50,
  width: Dimensions.get('screen').width*0.3,
  margin: 5,
  backgroundColor: Colors.primary,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5
},

})
