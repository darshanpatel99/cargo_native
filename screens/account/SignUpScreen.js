import React, { Component } from "react";
import { View, StyleSheet,Text,TextInput,Alert,Keyboard,TouchableWithoutFeedback, ImageBackground, Dimensions, KeyboardAvoidingView, Platform} from "react-native";
//Import related to Fancy Buttons
import { Button, Item } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../constants/Colors.js";
import firebase from '../../Firebase';
import AddUser from '../../functions/AddUser';
import { StackActions, NavigationActions } from 'react-navigation';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Google from 'expo-google-app-auth'
import * as AppAuth from 'expo-app-auth';
import {Notifications} from 'expo';
import * as Permissions from 'expo-permissions';
import Spinner from 'react-native-loading-spinner-overlay';
import SwitchToggle from 'react-native-switch-toggle';
import { colors } from "react-native-elements";
import * as Facebook from 'expo-facebook';


var KEYBOARD_VERTICAL_OFFSET_HEIGHT = 0;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
 );

export default class SignUpScreen extends Component {
  FacebookApiKey= '2872116616149463';

  constructor(props){
    super(props);
    //creating the firebase reference for the users collection
    this.firebaseRef = firebase.firestore().collection('Users');

    //Following is the state of this  component
    this.state ={
      password:'',
      prevPage:'',
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
      showAlert: true,
      showAlert2: false,
      showAlert3: false,
      showOverlay: false,
      deviceNotificationToken: '',
      expoNotificationToken:'',
      loading: false,
      switchOn1: false,
      isFacebookAuth:false,
      pendingCred:null
    }
  }

  componentDidMount() {
    // List to the authentication state
    this._unsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
    const magic = this.props.navigation.getParam('magic');
  
    if(magic == 'Login'){
      const pendingCredentials = this.props.navigation.getParam('pendingCred');
      console.log('Pending Crednetials', JSON.stringify(pendingCredentials));
      this.setState({pendingCred : pendingCredentials, isFacebookAuth:true});
      this.setState({switchOn1: true})
    }
  }
 
  componentWillUnmount() {
    // Clean up: remove the listener
    this._unsubscribe();
  }
 
  onAuthStateChanged = user => {
    console.log('Auth state of the user has been changed');
    // if the user logs in or out, this will be called and the state will update.
    // This value can also be accessed via: firebase.auth().currentUser
    //this.setState({ user });
    if (user != null){
      if(user.emailVerified){ // note difference on this line
        this.setState({user});
      }
    }
    else{
      this.setState({ user: null});
    }
  };

  //hide the alert
  hideAlert(){
    const { navigate } = this.props.navigation;
    this.setState({
      showAlert: true
    });
    navigate('Account');
  };

  //function to show the alert
  showAlert(){
    this.setState({
      showAlert: true,
      
    });
  };

    //hide the alert
    hideAlert2(){
      this.setState({
        showAlert2: false
      });

       //call the google login async, becasue this time we only two methods 
       this.googleLoginAsync(); 
    };
  
    //function to show the alert
    showAlert2(){
      this.setState({
        showAlert2: true,
        
      });
    };

     //hide the alert
     hideAlert3(){
      this.setState({
        showAlert2: false,
        switchOn1: true,
      });

       //call the google login async, becasue this time we only two methods 
       
    };
  
    //function to show the alert
    showAlert3(){
      this.setState({
        loading:false,
        showAlert3: true,
        
      });
    };
  

  getButtonText() {
    return this.state.switchOn1 ? 'Login' : 'Signup';
  }
  
  getRightText() {
    return this.state.switchOn1 ? '' : 'Login';
    //return 'Signup';
  }

  
  getLeftText() {
    //return this.state.switchOn1 ? 'Signup' : '';
    return 'Signup';
  }

  onPress1 = () => {
    this.setState({switchOn1: !this.state.switchOn1});
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
    console.log('fffffffffffffffffffaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaccccccccccccccccccccccccccccccccccc');
  
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

//google login function
async googleLogin(){

  try{
    //Configuration File
    const config ={ 
        expoClientId:'572236256696-192r30h6n62sreo89ctqcoq4e83jqrso.apps.googleusercontent.com',
        iosClientId:'572236256696-rebjkd10nh1rbveidpq4d338nrgga709.apps.googleusercontent.com',
        androidClientId:'572236256696-vmjaebnsmv5hg99f2os0bj5oc2ii2f30.apps.googleusercontent.com',
        iosStandaloneAppClientId: '572236256696-fergtsju84ade8lnro6au83sdaknnn4i.apps.googleusercontent.com',
        androidStandaloneAppClientId:'572236256696-rh7v7sgsr0fj2v1crgvgh8efgpp831uk.apps.googleusercontent.com',
        scopes:['profile', 'email'],
        redirectUrl: `${AppAuth.OAuthRedirect}:/oauth2redirect/google` // this is the LINE

    };


    if(Platform.OS=='ios'){
      this.setState({ loading: false });
    }
    //this.setState({ loading: false });
   

    const {type, accessToken} = await Google.logInAsync(config);

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


//Create a user with email and passord
emailSignUp = async (email, password)=>{
  console.log('Going to login user with given email and password');
  //saving email and password as the state
  this.setState({email:email, password:password});
  try{
    
      //get the curent user
      var currentUser = firebase.auth().currentUser;

      if(currentUser!=null){
        //if user already signed up before and has not verified the email just send the verification email again
        currentUser.sendEmailVerification().then((result)=>{
          console.log('email verification sent');
          var uid_ = currentUser.uid;  
          this.setState({UID:uid_, user:currentUser});
          //set the overlay parameter to tru
          this.setState({showOverlay:true});
  
        });
      }
      else{
      await firebase.auth().createUserWithEmailAndPassword(email,password).then(async(result)=>{
        console.log('Done creating the credentials');
        
        var user = result.user;
        var uid = user.uid;
        tempUID = uid;
        console.log('Your user get the following user uid: '+ uid);
        this.setState({UID:uid, user:user});
  
        //testing to send the email verification email
        
        user.sendEmailVerification().then((result)=>{
          console.log('email verification sent');
  
          //set the overlay parameter to tru
          this.setState({showOverlay:true});
  
        });
        //See if the email is verified or not
      }).catch((error)=>{

      });
    }
  
  }catch (error){
    alert(error.toString(error));
    console.log(error.toString(error));
  }
  
}

//sigUp with Email and password
emailLogin = async (email, password) =>{
  console.log('Going to sign in the user with email and password');
  try{
    await firebase.auth().signInWithEmailAndPassword(email, password).then((result)=>{
      console.log('Done validating the credentials');
      
      var user = result.user;
      var uid = user.uid;
      tempUID = uid;
      console.log('Your user get the following user uid: '+ uid);
      this.setState({UID:uid, user:user});


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
                console.log('2--inside firebase snap')

                //get the token and update the value
                this.getNotificationToken(userUID);

                if(this.state.isFacebookAuth){

                  var pendingFacebookCredentialsToLink = this.state.pendingCred;

                  user.linkAndRetrieveDataWithCredential(pendingFacebookCredentialsToLink).then(function(usercred) {
                    // Facebook account successfully linked to the existing Firebase user.
                    console.log('Your facebook account is successfully linked with google now, you can nytime login with facebook');
                  });
                }

                this.props.navigation.navigate('Account', {userid:this.state.UID});
              }
              else{
                console.log('User is not sign up');
                //if the user doesnot exist through them to the signup screen

                //this.props.navigation.navigate('SignUp', {prevPage: 'SignUp'});*******************
                this.showAlert();
              }
            });
          }
          catch (e) {
            alert('Following error occured during checking whether user exists or not:  ' + e)
            console.warn(e);
          } 
    }
    });
  }catch (error){
    //alert(error.toString(error));
    alert('Invaid email or password\n Please try again!')
    console.log(error.toString(error));
  }

}

//check whether the email is verified or not and sign in 
checkEmailVerifiedStatus=async ()=>{

  try{
  //because the FirebaseUser Object is cached within the app session so its good idea to reload the user
  firebase.auth().currentUser.reload();  
  //setting the state of the new user  
  this.setState({user:firebase.auth().currentUser});
  var user = this.state.user;
  //reloading the user
  
  var emailVerificationStatus = user.emailVerified;
  console.log('User email verification status: '+ emailVerificationStatus);
  if(emailVerificationStatus){

    var tempUID = this.state.UID;
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
              console.log('2--inside firebase snap')
              this.props.navigation.navigate('Account', {userid:this.state.UID});
            }
            else{
              console.log('User is not signed up');
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
  //call the hide screen
this.hideAlert();
     
}



  }catch (error){
    alert(error.toString(error));
    console.log(erro.toString(error));
  }
}

//email signUp
emailSignUpAsync=async()=>{

  console.log('In emailSignUpAsync method');
  console.log(this.state.email);

  if(this.state.firstName.length==0 ){
    alert('Please dont leave any field empty')
  }else{
      //only of the email is verified, than only call create the firebase user
      await this.emailSignUp(this.state.email, this.state.password);
  }

}

//email Login Async
emailLoginAsync = async () =>{
  console.log('in emailLoginAsync');
  console.log(this.state.email);

  await this.emailLogin(this.state.email, this.state.password);
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
                  if(this.state.isFacebookAuth){

                    var pendingFacebookCredentialsToLink = this.state.pendingCred;

                    user.linkAndRetrieveDataWithCredential(pendingFacebookCredentialsToLink).then(function(usercred) {
                      // Facebook account successfully linked to the existing Firebase user.
                      console.log('Your facebook account is successfully linked with google now, you can nytime login with facebook');
                    });
                  }
                  this.setState({ loading: false });
                  const resetAction = StackActions.reset({
                    index: 0, // <-- currect active route from actions array
                    //params: {userId: this.state.UID},
                    actions: [
                      NavigationActions.navigate({ routeName: 'Account', params: { userId: userUID}} ),
                    ],
                  });
                  
                  this.props.navigation.dispatch(resetAction);

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

                  this.setState({ loading: false, isFacebookAuth:true });
                  const resetAction = StackActions.reset({
                    index: 0, // <-- currect active route from actions array
                    //params: {userId: this.state.UID},
                    actions: [
                      NavigationActions.navigate({ routeName: 'Account', params: { userId: userUID}} ),
                    ],
                  });
                  
                  this.props.navigation.dispatch(resetAction);


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
              console.log(' show alert 3 called')
              this.showAlert3();
            }

            else{
              console.log('Alert Called')
              await this.showAlert2();
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




///No longer using this method but please dont delete it is here for reference
  onSignIn = async () => {
    console.log('ON sing in -- 1')
    const {confirmationResult, code} = this.state;
    var tempUID = null;
    try {
          // var tempUID = null;  
          //confirm the user with the code and get the user authentication data
        await confirmationResult.confirm(code).then((result)=>{
           console.log('on sign in -- 2')

          var user = result.user;
          var uid = user.uid;
          tempUID = uid;
          console.log('Your user get the following user uid: '+ uid);
          this.setState({UID:uid, user:user, userName:user.name, email:user.email, phoneNumber:user.PhoneNumber});
          
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
                    console.log('2--inside firebase snap')
                    this.props.navigation.navigate('Account');
                  }
                  else{
                    console.log('User is not sign up');
                    this.setState({nameRegistration:true});
                  // this.continueToNameReg();
                  }
                });
              }
              catch (e) {
                alert('Following error occured during checking whether user exists or not:  ' + e)
                console.warn(e);
              } 
            }
        });
      

    } catch (e) {
        console.warn('Following Error occured during the code confirmation:  ' +e);
    }

} 



deleteUserFromAuthDatabase() {
  var user = firebase.auth().currentUser;

  user.delete().then(function() {
    // User deleted.
    console.log('Account Deleted')
  }, function(error) {
    // An error happened.
    console.log(error)
  });
}


  navigateToAdress = () =>{
  const { navigate } = this.props.navigation;
    //this.props.navigation.dispatch(StackActions.popToTop());
    navigate('AddressScreen', {userId: '0zVVJrL8Pdb3ogpAmqV7oprwaah1'})
  }



   //Getting the push token for the device
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

  //set the notification token state
  setDeviceNotificationToken = async (token) =>{

    //setting the device notification token
    this.setState({deviceNotificationToken:token});
  }

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

  render() {
    const { navigation } = this.props;
    const prevPage = navigation.getParam('prevPage');
    console.log('This is signup screen ' + prevPage);
    const {showAlert} = this.state;
    const {showAlert2} = this.state;
    const {showAlert3} = this.state;    

    if(this.state.showOverlay==false){
    //if the prevPage is SignUp screen than ask for first name and last name 
    if(this.state.switchOn1 == true){

      return(

        <DismissKeyboard>
        <View style={styles.viewStyle}>
        <Spinner
            visible={this.state.loading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />

      <SwitchToggle
          buttonText={this.getButtonText()}
          backTextRight={this.getRightText()}
          backTextLeft={this.getLeftText()}
          
          type={1}
          buttonStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute'
          }}
          
          rightContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          leftContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}
        
          buttonTextStyle={{fontSize: 20}}
          textRightStyle={{fontSize: 20}}
          textLeftStyle={{fontSize: 20}}
        
          containerStyle={{
            marginTop: 16,
            width: 200,
            height: 50,
            borderRadius: 27.5,
            padding: 5,
            borderWidth:1,
            borderColor:'black',
            marginBottom: 100,
          }}
          backgroundColorOn='#fff'
          backgroundColorOff='#fff'
          circleStyle={{
            width: 100,
            height: 40,
            borderRadius: 27.5,
            backgroundColor: 'blue', // rgb(102,134,205)
          }}
          switchOn={this.state.switchOn1}
          onPress={this.onPress1}
          circleColorOff={colors.primary}
          circleColorOn={colors.primary}
          duration={0}
        />

      <View style={styles.container}>
          <TextInput
              placeholder= 'Email'
              underlineColorAndroid="transparent"
              autoCapitalize='none'
              autoCorrect={false}
              style={styles.TextInputStyle}
              onChangeText = {email => this.setState({email:email.trim()})}
              />
      </View>

      <Item style={styles.container}>                
        <TextInput style={styles.TextInputStyle}
          secureTextEntry={true}
          placeholder= 'Password'
          autoCapitalize='none'
          autoCorrect={false}
          underlineColorAndroid="transparent"  
          onChangeText={password=> this.setState({password:password})} 
        />                        
      </Item>

        <Button large-green style={styles.button} onPress={this.emailLoginAsync}>
        <Ionicons
                  size={30}
                  color="#fff"
                  style={styles.icon}
                  name='ios-mail'
                />
            <Text style={styles.lightText} >Login</Text>
        </Button>

      <Text>Or</Text>

      {/* <Button large-green style={styles.button} onPress ={this.facebookLoginAsync}>
        <FontAwesome
          size={30}
          color="#fff"
          style={styles.icon}
          name='facebook-square'
        />
        <Text style={styles.lightText}>Facebook Login</Text>
      </Button> */}

      <Button large-green style={styles.button} onPress ={this.googleLoginAsync}>
        <Ionicons
          size={30}
          color="#fff"
          style={styles.icon}
          name='logo-google'
        />
        <Text style={styles.lightText}>Google Login</Text>
      </Button>

      <Text>Or</Text>

      <Button large-green style={styles.button} onPress ={()=> this.props.navigation.navigate('ChangePassword')}>
        <Text style={styles.lightText}>Forgot Password</Text>
      </Button>
 
    </View>
    </DismissKeyboard>
    );

    
    }else{

      //Returning the UI elements on this page
    return (

      <DismissKeyboard>
      <KeyboardAvoidingView style={styles.viewStyle} behavior="padding" enabled>
        <Spinner
            visible={this.state.loading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
          <SwitchToggle
          buttonText={this.getButtonText()}
          backTextRight={this.getRightText()}
          backTextLeft={this.getLeftText()}
          
          type={1}
          buttonStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute'
          }}
          
          rightContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          leftContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}
        
          buttonTextStyle={{fontSize: 20}}
          textRightStyle={{fontSize: 20}}
          textLeftStyle={{fontSize: 20}}
        
          containerStyle={{
            marginTop: 16,
            width: 200,
            height: 50,
            borderRadius: 27.5,
            padding: 5,
            borderWidth:1,
            borderColor:'black',
            marginBottom: 100,
          }}
          backgroundColorOn='#fff'
          backgroundColorOff='#fff'
          circleStyle={{
            width: 100,
            height: 40,
            borderRadius: 27.5,
            backgroundColor: 'blue', // rgb(102,134,205)
          }}
          switchOn={this.state.switchOn1}
          onPress={this.onPress1}
          circleColorOff={colors.primary}
          circleColorOn={colors.primary}
          duration={0}
        />
        <View style={styles.container}>
          <TextInput
              placeholder= 'Full Name'
              underlineColorAndroid="transparent"
              autoCorrect={false}
              style={styles.TextInputStyle}
              onChangeText = { firstName=> this.setState({firstName:firstName})}
              />
          </View>

          {/* <View style={styles.container}>
              <TextInput
                  placeholder= 'Last Name'
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  style={styles.TextInputStyle}
                  onChangeText = { lastName=> this.setState({lastName:lastName})}
                  />
          </View> */}


        <View style={styles.container}>
            <TextInput
                placeholder= 'Email'
                underlineColorAndroid="transparent"
                autoCapitalize='none'
                autoCorrect={false}
                style={styles.TextInputStyle}
                onChangeText = {email => this.setState({email:email.trim()})}
                />
        </View>

          <Item style={styles.container}>                
                  <TextInput style={styles.TextInputStyle}
                        secureTextEntry={true}
                        placeholder= 'Password'
                        autoCapitalize='none'
                        autoCorrect={false}
                        underlineColorAndroid="transparent"  
                        onChangeText={password=> this.setState({password:password})} 
                    />                        
          </Item>


          <Button large-green style={styles.button} onPress={this.emailSignUpAsync}>
          <Ionicons
                  size={30}
                  color="#fff"
                  style={styles.icon}
                  name='ios-mail'
                />
              <Text style={styles.lightText} >Signup</Text>
          </Button>
                
        <Text>Or</Text>

        {/* <Button large-green style={styles.button} onPress ={this.facebookLoginAsync}>
              <FontAwesome
                size={30}
                color="#fff"
                style={styles.icon}
                name='facebook-square'
              />
              <Text style={styles.lightText}>Facebook Signup</Text>
            </Button> */}

          <Button large-green style={styles.button}  onPress ={this.googleLoginAsync}>
            <Ionicons
              size={30}
              color="#fff"
              style={styles.icon}
              name='logo-google'
            />
            <Text style={styles.lightText} onPress ={this.googleLoginAsync}>Google Signup</Text>
          </Button>

          <AwesomeAlert
              show={showAlert2}
              showProgress={false}
              title="Oops!"
              message={'You are signed up with different provider\n Link your facebook account'}
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={false}
              showConfirmButton={true}
              cancelText="No, cancel"
              confirmText="Link now"
              confirmButtonColor= {Colors.primary}
              onConfirmPressed={() => this.hideAlert2()}
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
      </KeyboardAvoidingView>
      </DismissKeyboard>
    );
    }

    }
    
    else{
      console.log('Showing the awesomeAlert');
        
      return (
       
        <View style={styles.alertContainer}>   
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Alert"
            message="Please verify email first After verification press SignIn Button"
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="Resend email"
            confirmText="SignIn!!"
            confirmButtonColor={Colors.primary}
            onCancelPressed={() => {
              this.setState({user:null});
              this.hideAlert();
              this.deleteUserFromAuthDatabase()
              this.props.navigation.navigate('SignUp')

            }}
            onConfirmPressed={() => {
              this.checkEmailVerifiedStatus();
            }}
          />


        </View>
      );
      }
    }
  }



const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
    alignItems: 'center',
    //justifyContent: 'center'
  },

  button: {
    width: Dimensions.get('window').width - 100,
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    height: 50,
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
    height: 50,
    width: Dimensions.get('window').width - 100,
    margin: 5
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 1.2
  },
  secondaryText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 1.2
  },
  lightText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 1.2
  },
  icon: {
    padding: 5,
    paddingRight: 10
  },
  iconstyle: {
    paddingRight:10,
},
TextInputStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    height: 50,
    width: Dimensions.get('window').width - 100,
    borderRadius: 20,
    margin: 10,
    backgroundColor: "#f8f8f8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
},
container: {
    flex: 0, 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    height: 50,
    width: Dimensions.get('window').width - 100,
    margin:10,
    //backgroundColor: "#f8f8f8",
},
alertContainer:{
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
},
  
spinnerTextStyle: {
  color: '#0000FF'
},
});
