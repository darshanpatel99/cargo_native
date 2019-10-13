import React, { Component } from "react";
import { View, StyleSheet,Text,TextInput,Alert,Keyboard,TouchableWithoutFeedback, Dimensions, KeyboardAvoidingView, Platform} from "react-native";
//Import related to Fancy Buttons
import { Button, Item } from "native-base";
import { Ionicons } from "@expo/vector-icons";
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
      showOverlay: false,
      deviceNotificationToken: '',
      expoNotificationToken:'',
      loading: false,
    }

    

  }

  componentDidMount() {
    // List to the authentication state
    this._unsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

    
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
      this.setState({ User: null});
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





//facebook Login Function
async facebookLogin() {
  console.log("in facebookLogin() method");
  try{
    const authData = await Facebook.logInWithReadPermissionsAsync(this.FacebookApiKey,{
      permissions:['public_profile']
    });
  
    console.log(authData);
    if (!authData) return;
    const { type, token } = authData;
    if (type === 'success') {
      console.log('facebook auth success and the token is' + token);
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


//Create a user with email and passord
emailSignUp = async (email, password)=>{
  console.log('Going to login user with given email and password');
  //saving email and password as the state
  this.setState({email:email, password:password});
  try{
    await firebase.auth().createUserWithEmailAndPassword(email,password).then((result)=>{
      console.log('Done creating the credentials');
      
      var user = result.user;
      var uid = user.uid;
      tempUID = uid;
      console.log('Your user get the following user uid: '+ uid);
      this.setState({UID:uid, user:user});

      //testing to send the email verification email
      
      user.sendEmailVerification().then((result)=>{
        console.log('email verification sent');
        alert('email verification sent');

        //set the overlay parameter to tru
        this.setState({showOverlay:true});

      });

      //See if the email is verified or not


    //   if(tempUID!=null){
    //     console.log("THIS is UUID =-=-=> " + tempUID)
    //     this.setState({UID:tempUID});
    //     try{
    //       //verify user is signed up or not
    //       var userUID = this.state.UID;
    //       console.log('The uid that is going to be verified: ' + userUID);
      
            
    //       this.firebaseRef.doc(userUID)
    //         .get()
    //         .then(docSnapshot => {
    //           console.log('1--inside firebase snap')
    //           if(docSnapshot.exists){
    //             console.log('2--inside firebase snap')
    //             //through them to the account screen and pass the  user uid  so that we can only get details for the current user
    //             this.props.navigation.navigate('Account', {userid:this.state.UID});
    //           }
    //           else{
    //             console.log('User is not sign up');
    //             //add user to the database using the finishFunc
    //             this.finishFunc();
            
    //           }
    //         });
    //       }
    //       catch (e) {
    //         alert('Following error occured during checking whether user exists or not:  ' + e)
    //         console.warn(e);
    //       } 
    // }
    });
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

                this.props.navigation.navigate('Account', {userid:this.state.UID});
              }
              else{
                console.log('User is not sign up');
                //if the user doesnot exist through them to the signup screen

                this.props.navigation.navigate('SignUp', {prevPage: 'SignUp'});

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
    alert(error.toString(error));
    console.log(erro.toString(error));
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

  if(this.state.firstName.length==0 || this.state.lastName.length==0 ){
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
      console.log('User phone number is: ' + user.email);
      this.setState({UID:uid, user:user, email:user.email});

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
    alert('User deleted')
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
    

    if(this.state.showOverlay==false){
    //if the prevPage is SignUp screen than ask for first name and last name 
    if(prevPage=='SignUp'){

    //Returning the UI elements on this page
    return (

      <DismissKeyboard>
        
      <KeyboardAvoidingView style={styles.viewStyle} behavior="padding" enabled>
        <Spinner
            visible={this.state.loading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />

        <View style={styles.container}>
              <TextInput
                  placeholder= 'First Name'
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  style={styles.TextInputStyle}
                  onChangeText = { firstName=> this.setState({firstName:firstName})}
                  />
          </View>

          <View style={styles.container}>
              <TextInput
                  placeholder= 'Last Name'
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  style={styles.TextInputStyle}
                  onChangeText = { lastName=> this.setState({lastName:lastName})}
                  />
          </View>


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
              <Text style={styles.lightText} >{prevPage}</Text>
          </Button>
                
        <Text>Or</Text>

          <Button large-green style={styles.button}  onPress ={this.googleLoginAsync}>
            <Ionicons
              size={30}
              color="#fff"
              style={styles.icon}
              name='logo-google'
            />
            <Text style={styles.lightText} onPress ={this.googleLoginAsync}>Google {prevPage}</Text>
          </Button>
      </KeyboardAvoidingView>
      </DismissKeyboard>
    );
    }else{
      return(

        <DismissKeyboard>

        <View style={styles.viewStyle}>
        <Spinner
            visible={this.state.loading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
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
            <Text style={styles.lightText} >{prevPage}</Text>
        </Button>

      <Text>Or</Text>

      <Button large-green style={styles.button} onPress ={this.googleLoginAsync}>
        <Ionicons
          size={30}
          color="#fff"
          style={styles.icon}
          name='logo-google'
        />
        <Text style={styles.lightText}>Google {prevPage}</Text>
      </Button>

      <Text>Or</Text>

      <Button large-green style={styles.button} onPress ={()=> this.props.navigation.navigate('ChangePassword')}>
        <Text style={styles.lightText}>Forgot Password</Text>
      </Button>
 
    </View>
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
            message="Please verify email first! After verification press SignIn Button"
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="SignIn!!"
            confirmButtonColor={Colors.primary}
            onCancelPressed={() => {
              this.setState({user:null});
              this.hideAlert();
              this.deleteUserFromAuthDatabase()
              this.props.navigation.navigate('Account')

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
    justifyContent: 'center'
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
    backgroundColor: "#f8f8f8",
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
