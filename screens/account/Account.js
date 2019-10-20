import React, {Component} from 'react';
import { StyleSheet,View,Dimensions, Image, ImageBackground,TextInput,KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, Platform} from 'react-native';
import Colors from "../../constants/Colors.js";
import firebase from '../../Firebase.js';
import { Button, Text} from "native-base";
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import { FontAwesome} from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";
import * as Google from 'expo-google-app-auth'
import * as AppAuth from 'expo-app-auth';
import {Notifications} from 'expo';
import Spinner from 'react-native-loading-spinner-overlay';
import AddUser from '../../functions/AddUser';
import { StackActions, NavigationActions } from 'react-navigation';
import * as Facebook from 'expo-facebook';
import AwesomeAlert from 'react-native-awesome-alerts';

let storageRef;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
 );

export default class AccountScreen extends React.Component {

  //facebook api
  FacebookApiKey= '2872116616149463';

  constructor(props){
    super(props);
    storageRef = firebase.storage().ref();

    //creating the firebase reference for the users collection
    this.firebaseRef = firebase.firestore().collection('Users');

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
    loading:false,
    phoneNumber:'',
    remove:true,
    buttonOn:false,           
    user: null,
    phone:'',
    confirmationResult: undefined,
    code: '',
    Token: '',
    valid:false,
    emailRegistration:false,
    nameRegistration:false,
    firstName:'',
    lastname:'',
    email:'',
    country:'',
    city:'',
    street:'',
    UID:'',
    profilePic:'',
    //showAlert: true,
    showOverlay: false,
    deviceNotificationToken: '',
    expoNotificationToken:'',
    firstTimeGoogleSignUp:true,
    showAlert: false,
    showAlert3: false,
    isFacebookAuth: false,
    pendingCred:null,
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

  //bind the function
  this.logoutAsync = this.logoutAsync.bind(this);
  this.showAlert = this.showAlert.bind(this);
  this.hideAlert = this.hideAlert.bind(this);
}

//component did mount
componentDidMount() {
  const { navigation } = this.props;

    this.focusListener = navigation.addListener('didFocus', () => { 
    //checking the current user and setting uid
    
    let user = firebase.auth().currentUser;

    if (user != null) {
      this.setState({firstTimeGoogleSignUp:false});
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
  if (user != null ){
    if(user.emailVerified || user.providerData[0].providerId=='facebook.com'){ // note difference on this line
     
      this.setState({ User: user});
    }
  }
  else{
    this.setState({ User: null});
  }
};  

showAlert = () => {
  this.setState({
    loading:false,
    showAlert: true
  });
};

hideAlert = async () => {
  const { navigate } = this.props.navigation;

  console.log('Hide alert called')
  this.setState({
    showAlert: false
  });
  //call the google login async, becasue this time we only two methods 
  await this.googleLoginAsync(); 
};

     //hide the alert
     hideAlert3(){
      const { navigate } = this.props.navigation;
      this.setState({
        showAlert3: false,
      });   
      navigate('SignUp',{magic: 'Login', pendingCred : this.state.pendingCred})   
    };
  
    //function to show the alert
    showAlert3(){
      this.setState({
        loading:false,
        showAlert3: true,
        
      });
    };

/**
 * Function Description: Google login, get the user access token 
 */
//google login function
async googleLogin(){

  try{
  


    //Configuration File
    const configDev ={ 
        expoClientId:'12592995924-cmat1v9r7i2muq4j14ilfjcbbdcftod7.apps.googleusercontent.com', // cargo-dev
        iosClientId:'12592995924-93bvpjbll346oa2kg33kfm574lg7r2q5.apps.googleusercontent.com', //cargo-dev
        androidClientId:'12592995924-6sul322o56a88e3cs0o6627jlfq22l88.apps.googleusercontent.com', //cargo-dev
        iosStandaloneAppClientId: '12592995924-kcoo3s6sgqhkh46ggap62e36dgjhbq4o.apps.googleusercontent.com',//cargo-dev
        androidStandaloneAppClientId:'12592995924-c6jjfdudjgk0t8n3pumj2obti504edrv.apps.googleusercontent.com', //cargo-dev
        scopes:['profile', 'email'],
        redirectUrl: `${AppAuth.OAuthRedirect}:/oauth2redirect/google` // this is the LINE 

    };

    if(Platform.OS=='ios'){
      this.setState({ loading: false });
    }
    //this.setState({ loading: false });
   
    console.log('Going to open a web view');
    const {type, accessToken} = await Google.logInAsync(configDev);

    if(type=='success'){

      //alert('You got looged in with google');

      // Alert.alert(
      //   'Alert',
      //   'You got logged in with google',
      //   [
      //     // {text: 'OK', onPress: () => this.props.navigation.navigate('Home')},
      //     {text: 'OK'},
      //   ],
      //   {cancelable: true},
      // );
      
      //start the loader again
      console.log('successfully got the access topken');
      this.setState({ loading: true });

      return accessToken;
    }
    else{
      this.setState({ loading: false });
    }

  }catch({message}){
    this.setState({ loading: false });
    //alert('');
  }
}


//Google Login Async functions
googleLoginAsync = async () => {

  this.setState({ loading: true });
  console.log('statettttttttttttttttttttttttttttttt: '+this.state.loading);
  // First we login to google and get an "Auth Token" then we use that token to create an account or login. This concept can be applied to github, twitter, google, ect...
  const accessToken = await this.googleLogin();

  if (!accessToken) return;
  // Use the google token to authenticate our user in firebase.
  const credential = firebase.auth.GoogleAuthProvider.credential(null,accessToken);

  console.log('Got the credentials from Google SignIn');
  try {
    // login with credential
    await firebase.auth().signInWithCredential(credential).then((result)=>{
      console.log('Done creating credentials with the Google');

      var user = result.user;
      var uid = user.uid;
      tempUID = uid;
      console.log('Your user get the following user uid: '+ uid);
      this.setState({UID:uid, user:user, email:user.email, firstName:user.displayName});

       //setting the UID
       if(tempUID!=null){
          console.log("THIS is UUID =-=-=> " + tempUID)
          this.setState({UID:tempUID});
          try{
            //verify user is signed up or not
            var userUID = this.state.UID;
            
            console.log('The uid that is going to be verified: ' + userUID);

            this.firebaseRef.doc(userUID)
              .get()
              .then(docSnapshot => {
                console.log('1--inside firebase snap')
                if(docSnapshot.exists){
                 
                  console.log('2--inside firebase snap');
                  
                  
                  this.getNotificationToken(userUID);
                  console.log('Notification token has been updated');
                  console.log('2--inside firebase snap');
                  
                  //set the states to the enw values
                  this.setState({
                    data: docSnapshot.data(),
                    name:docSnapshot.data().FirstName,
                    //globalAddress:doc.data().City + ', ' + doc.data().Country,
                    UnitNumber:docSnapshot.data().UnitNumber,
                    Address:docSnapshot.data().Address,
                    Email:docSnapshot.data().Email,
                    PhoneNumber:docSnapshot.data().PhoneNumber,
                    picture:docSnapshot.data().ProfilePicture,
                    }); 


                    //link the facebook credentials if user is trying to login with facebook but have same email used with facebook

                    if(this.state.isFacebookAuth){

                      var pendingFacebookCredentialsToLink = this.state.pendingCred;

                      user.linkAndRetrieveDataWithCredential(pendingFacebookCredentialsToLink).then(function(usercred) {
                        // Facebook account successfully linked to the existing Firebase user.
                        console.log('Your facebook account is successfully linked with google now, you can nytime login with facebook');
                      });


                    }





                  this.setState({ loading: false, firstTimeGoogleSignUp : false });

                  // const resetAction = StackActions.reset({
                  //   index: 0, // <-- currect active route from actions array
                  //   //params: {userId: this.state.UID},
                  //   actions: [
                  //     NavigationActions.navigate({ routeName: 'Account', params: { userId: userUID}} ),
                  //   ],
                  // });
                  
                  // this.props.navigation.dispatch(resetAction);

                  //this.props.navigation.navigate('Account', {userID: userUID,});
                }
                else{
                  console.log('User is not sign up');
                  //add user to the database using the finishFunc

                  this.finishFunc();
              
                }
               
              });
            }
            catch (e) {
              alert('Following error occured during checking whether user exists or not:  ' + e)
              console.warn(e);
            } 
      }
      
    });;
  } catch ({ message }) {
    alert(message);
  }
};



//facebook Login Function
async facebookLogin() {
  console.log("in facebookLogin() method");
  try{
    if(Platform.OS=='ios'){
      this.setState({ loading: false });
    }
    const authData = await Facebook.logInWithReadPermissionsAsync(this.FacebookApiKey,{
      permissions:['public_profile', 'email']
    });

    if(Platform.OS=='ios'){
      this.setState({ loading: false });
    }
  
    console.log(authData);
    if (!authData) return;
    const { type, token } = authData;
    if (type === 'success') {
      console.log('facebook auth success and the token is' + token);

      //set the loading state to true
      this.setState({loading:true});

      return token;
    } else {
      // Maybe the user cancelled...
    }
  }
  catch(message){
    console.log(message);
    alert(message);
    
  }
}


//Facebook Login Async Function
facebookLoginAsync = async () => {

  this.setState({ loading: true });
  console.log('in facebookLoginAsync() method');
  // First we login to facebook and get an "Auth Token" then we use that token to create an account or login. This concept can be applied to github, twitter, google, ect...
  const token = await this.facebookLogin();
  if (!token) return;
  try {
  //get the required user information related to the 
  const userInfo = await fetch(`https://graph.facebook.com/me?access_token=${token}`);

  var userJson = (await userInfo.json());
  console.log(userJson.name);
  
  //user information
  var firstName = userJson.name;

  console.log(firstName);


  //setting all the user information
  this.setState({firstName:firstName });


  // Use the facebook token to authenticate our user in firebase.
  const credential = firebase.auth.FacebookAuthProvider.credential(token);
 
    // login with credential
    var tempUID = null ;
    await firebase.auth().signInWithCredential(credential).then((result)=>{
      console.log('Done creating credentials with the facebook');

      var user = result.user;
      var uid = user.uid;
      tempUID = uid;
      console.log('Your user get the following user uid: '+ uid);
      console.log('User email is: ' + user.email);
      this.setState({UID:uid, user:user, email:user.email});

      console.log(user.providerData)

       //setting the UID
       if(tempUID!=null){
          console.log("THIS is UUID =-=-=> " + tempUID)
          this.setState({UID:tempUID});
          try{
            //verify user is signed up or not
            var userUID = this.state.UID;
            console.log('The uid that is going to be verified: ' + userUID);
        
             
            this.firebaseRef.doc(userUID)
              .get()
              .then(docSnapshot => {
                console.log('1--inside firebase snap')
                if(docSnapshot.exists){
                  
                  this.getNotificationToken(userUID);
                  console.log('Notification token has been updated');
                  console.log('2--inside firebase snap');
                  
                  //set the states to the enw values
                  this.setState({
                    data: docSnapshot.data(),
                    name:docSnapshot.data().FirstName,
                    //globalAddress:doc.data().City + ', ' + doc.data().Country,
                    UnitNumber:docSnapshot.data().UnitNumber,
                    Address:docSnapshot.data().Address,
                    Email:docSnapshot.data().Email,
                    PhoneNumber:docSnapshot.data().PhoneNumber,
                    picture:docSnapshot.data().ProfilePicture,
                    }); 

                  this.setState({ loading: false, isFacebookAuth:true, firstTimeGoogleSignUp:false });
                }
                else{
                  console.log('User is not sign up');
                  //Add user to the database
                  this.finishFunc();
                  
                }
              });
            }
            catch (e) {
              alert('Following error occured during checking whether user exists or not:  ' + e)
              console.warn(e);
            } 
      }
    }).catch(async (error)=>{
      console.log('In the error');
      if(error.code === 'auth/account-exists-with-different-credential')
        {
          console.log('Its Duplicate');

          var pendingCred = error.credential;
          var email = error.email;
          console.log(JSON.stringify(error));

          //set the pending credentials state
          this.setState({pendingCred:pendingCred, isFacebookAuth:true});

          

          firebase.auth().fetchSignInMethodsForEmail(email).then(async (method)=>{

            //If first sign in method is password it is important to prompt user for login with email and password
            if(method[0]=='password'){
              this.showAlert3();
            }
            else{
              console.log('Alert Called')
              await this.showAlert();
            }




          }).catch((error)=>{
            console.log(error);
          })

        }
    });
  } catch ({ message }) {
    alert(message);
  }
}


/**
 * Function Description: Get the provider for provid
 */
getProviderForProviderId = async(providerId)=>{

  if(providerId=='firebase.com'){
    return 'facebookProvider';
  }
  else if(providerId=='google.com'){

    return 'googelProvider';
  }



}



/**
 * Function Description: Get the device notification token
 */
getNotificationToken = async (userUID) =>{
  try{
      
      console.log('Getting the Notification Token');
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
    
      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        console.log('Notification permission is not granted');
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
    
      // Stop here if the user did not grant permissions
      if (finalStatus !== 'granted') {
        return;
      }
    // Get the token that uniquely identifies this device
      
    console.log('going to get the notification token');
    
     await Notifications.getDevicePushTokenAsync().then((token)=>{
        console.log('Got the following device notification token: '+ token);
        console.log('Type of token: '+ typeof(token));
        //this.setState({deviceNotificationToken:token});
        this.firebaseRef.doc(userUID).update({NotificationToken:token});
        
      });

      await Notifications.getExpoPushTokenAsync().then((token)=>{
        console.log('Got the following device expo notification token: '+ token);
        console.log('Type of token: '+ typeof(token));
        //this.setState({expoNotificationToken:token});
        this.firebaseRef.doc(userUID).update({ExpoNotificationToken:token});
      });


    
  }
  catch(error){
    alert(error);
  }
}


/**
 * Function Description: Finish It Bruh
 */
finishFunc =() =>{

  console.log('In the finishFunc function');
  
  //Sample dat object for each user
  var data={
    ActiveProducts : [],
    BoughtProducts : [],
    Cart : [],
    City : '',
    Country : '',
    Email : this.state.email,
    FirstName : this.state.firstName,
    LastName : this.state.lastname,
    PhoneNumber : this.state.phoneNumber,
    ProfilePicture :'',
    SoldProducts : [],
    Street : '',
    Address:'',
    UnitNumber:'',
    UID: this.state.UID.toString(),
    NotificationToken: this.state.deviceNotificationToken,
    ExpoNotificationToken: this.state.expoNotificationToken,
  }

  // const resetAction = StackActions.reset({
  //   index: 0,
  //   //action:[NavigationActions.navigate({routeName: 'AccountInfo'})]
  // })
  //adding the suer with the all the information we have to firebase
  AddUser(data).then(()=>{
      //Get the notification token
      this.getNotificationToken(this.state.UID);

  });
  
  console.log('Hello! finished adding data');
  console.log('following data is added ' + data);
  this.setState({ loading: false });
  const resetAction = StackActions.reset({
    index: 0, // <-- currect active route from actions array
    //params: {userId: this.state.UID},
    actions: [
      NavigationActions.navigate({ routeName: 'UserAddressScreen', params: { userId: this.state.UID }} ),
    ],
  });
  
  this.props.navigation.dispatch(resetAction);



  // this.props.navigation.navigate('UserAddressScreen', {userId: this.state.UID });
  // this.props.navigation.dispatch(resetAction);
  // this.setState({
  //     phone: '',
  //     phoneCompleted: false,
  //     confirmationResult: undefined,
  //     code: '',
  //     email:'',
  //     userName:'',
  //     phoneNumber:'',
  //     nameRegistration:false,
  //     emailRegistration:false,

  // });
}

  //Function to logo out user21`22122
  async logoutAsync() {
    try {
      this.setState({
        name:'',
        //globalAddress:doc.data().City + ', ' + doc.data().Country,
        UnitNumber:'',
        Address:'',
        Email:'',
        PhoneNumber:'',
        picture:'',
        isFacebookAuth:false,
        pendingCred:null
        });
    
     await firebase.auth().signOut();
     
      //props.navigation.navigate('Home');
      // const { navigate } = this.props.navigation;
      // navigate('ChatScreen')
    } catch ({ message }) {
      alert('You are logged out!! ' + message);
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

  uploadImageToFirebase = async (uri, localSizeObject) => {

    console.log("width " + localSizeObject.width + " height " + localSizeObject.height)

    var changedH = {
      'isBiggest' : false,
      'value' : localSizeObject.height,
      'valid' : true,
    }
   var changedW = {
    'isBiggest' : false,
    'value' : localSizeObject.width,
    'valid' : true,
  }

  var difValue = 1 ;
   
   if(changedH.value < changedW.value){
     changedW.isBiggest = true;

    if(changedW.value  <= 400){
      changedW.valid = false
    }
    
   }
   else{
     changedH.isBiggest = true;
     if(changedH.value  <= 400){
       changedH.valid = false
     }
      
   }

    if(changedH.isBiggest == true && changedH.valid == true){
      console.log("inside of the if statements");
      difValue = Math.round(changedH.value/400);
    }

    if(changedW.isBiggest == true && changedW.valid == true){
      difValue =Math.round(changedW.value/400) ;
    }

    var finalH = 1 ; 
    var finalW = 1 ;
    
    finalH = changedH.value/difValue;

    finalW = changedW.value/difValue;

    console.log(finalW + "  " + finalH)


    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize:{width:finalW, height:finalH} }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
    )

      console.log("Hey I  am the ManipResult:  "+ manipResult.uri);

    const response = await fetch(manipResult.uri);
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

    console.log("W2 " + result.width + "  H2" + result.height);
    console.log(result);

    this.setState({
      newPicture:[this.state.data.ProfilePicture],
      
    });

    if(!result.cancelled){
      console.log(result.uri);   
    
    await this.uploadImageToFirebase(result.uri,  this.sizeOfImageObj(result))
        .then(() => {
          console.log('Success' + uuid.v1());
            
        })
        .catch(error => {
          console.log('Success' + uuid.v1()); 
          console.log(error);
        });
      }
  }

  sizeOfImageObj = (result) =>{

    var imageWidth = result.width;
    var imageHeigth = result.height;
    var biggerSide =0;
    var smallerSide = 0 ;

    if(imageHeigth>imageWidth){
      biggerSide = imageHeigth;
      smallerSide = imageWidth;
    }
    if(imageHeigth<imageWidth){
      biggerSide = imageWidth;
      smallerSide = imageHeigth;
    }
    if(imageHeigth == imageWidth)
    {
      biggerSide = imageHeigth;
      smallerSide = imageWidth;
    }

    var localSizeObject = {
      'height' : imageHeigth,
      'width' : imageWidth,
    }

    return localSizeObject;
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
    const {showAlert} = this.state;
    const {showAlert3} = this.state;
    let profileImage=''

    if(this.state.picture == '') {
      profileImage=require('../../assets/images/user.png')
    }
    else{
      profileImage= {uri:this.state.picture}
    }
    
    if(this.state.User != null && this.state.firstTimeGoogleSignUp==false){

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
          <ImageBackground source={require('../../assets/images/Signup.png')} style={{width: '100%', height: '100%'}}>         
            <View style={styles.viewStyle}>
              <View style={styles.logoStyle}>
              <Spinner
                visible={this.state.loading}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
                />
                {/* <Image
                style={{width: 300, height: 300, borderRadius:20}}
                source={require('../../assets/images/icon.png')}
              /> */}
                <Text
                  style={{
                    fontSize: Dimensions.get('screen').width * 0.18,
                    fontFamily: 'origo',
                    fontWeight: 'bold',
                    color:'white'
                  }}
                >
                  CarGo
                </Text>
                  <Text style={{
                    fontSize:20,
                    fontFamily: 'nunito-SemiBold',
                    textAlign:'center',
                    marginTop:20,
                    color:'white',
                    fontWeight: 'bold',
                  }}>Post, buy, sell and watch as your items are delivered right to your door.</Text>

              </View>

            <View style={styles.bigButton}>

            <Button large-green style={styles.loginbutton} onPress ={this.facebookLoginAsync}>
              <FontAwesome
                size={30}
                color="#fff"
                style={styles.icon}
                name='facebook-square'
              />
              <Text style={styles.lightText}>Continue with Facebook</Text>
            </Button>

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
                    color:'white'
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

            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title="Oops!"
                message={'You are logged in different provider\n Link your facebook account'}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                cancelText="No, cancel"
                confirmText="Link now"
                confirmButtonColor= {Colors.primary}
                onConfirmPressed={() => this.hideAlert()}
              />

            <AwesomeAlert
              show={showAlert3}
              showProgress={false}
              title="Oops!"
              message={'You are signed up with email before \n Link your email account'}
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={false}
              showConfirmButton={true}
              cancelText="No, cancel"
              confirmText="Link now"
              confirmButtonColor= {Colors.primary}
              onConfirmPressed={() => this.hideAlert3()}
          />

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
    width: Dimensions.get('window').width - 60,
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
