import React, { Component } from "react";
import { View, StyleSheet,Text,TextInput,Dimensions,Alert, KeyboardAvoidingView } from "react-native";
//Import related to Fancy Buttons
import { Button, Item } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors.js";
import { clear } from "sisteransi";
import * as WebBrowser from 'expo-web-browser';
import {Linking} from 'expo';
import firebase from '../../Firebase';
import AddUser from '../../functions/AddUser';
import MainButton from "../../components/theme/MainButton"; //components\theme\MainButton.js
import { StackActions, NavigationActions } from 'react-navigation';
//importing packages related to the sign in
import * as Facebook from 'expo-facebook';
import {Google} from 'expo';
import { TouchableOpacity } from "react-native-gesture-handler";
import StyledTextInput from '../../components/theme/StyledTextInput';
import AwesomeAlert from 'react-native-awesome-alerts';
import { tsConstructorType } from "@babel/types";

var KEYBOARD_VERTICAL_OFFSET_HEIGHT = 0;
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
    this.setState({ user });
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
    const config ={ 
        expoClientId:'572236256696-192r30h6n62sreo89ctqcoq4e83jqrso.apps.googleusercontent.com',
        iosClientId:'572236256696-fergtsju84ade8lnro6au83sdaknnn4i.apps.googleusercontent.com',
        androidClientId:'572236256696-rh7v7sgsr0fj2v1crgvgh8efgpp831uk.apps.googleusercontent.com',
        scopes:['profile', 'email']
    };

    const {type, accessToken} = await Google.logInAsync(config);

    if(type=='success'){
      //alert('You got looged in with google');

      Alert.alert(
        'Alert',
        'You got logged in with google',
        [
          // {text: 'OK', onPress: () => this.props.navigation.navigate('Home')},
          {text: 'OK'},
        ],
        {cancelable: true},
      );
      return accessToken;
    }

  }catch({message}){
    alert('login: ' + message);
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
  console.log('in loginAsync() method');

  // First we login to google and get an "Auth Token" then we use that token to create an account or login. This concept can be applied to github, twitter, google, ect...
  const accessToken = await this.googleLogin();

  if (!accessToken) return;
  // Use the facebook token to authenticate our user in firebase.
  const credential = firebase.auth.GoogleAuthProvider.credential(null,accessToken);
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
                  console.log('2--inside firebase snap')

                  this.props.navigation.navigate('Account', {userID: userUID,});
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

  finishFunc =() =>{

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
      ProfilePicture : 'https://firebasestorage.googleapis.com/v0/b/cargo-488e8.appspot.com/o/UserImages%2Favatar.png?alt=media&token=91ea9f59-11a8-4928-9963-0235a0cd5201',
      SoldProducts : [],
      Street : '',
      Address:'',
      UnitNumber:'',
      UID: this.state.UID.toString(),
    }

    // const resetAction = StackActions.reset({
    //   index: 0,
    //   //action:[NavigationActions.navigate({routeName: 'AccountInfo'})]
    // })
    //adding the suer with the all the information we have to firebase
    AddUser(data);
    console.log('Hello! finished adding data');
    console.log('following data is added ' + data);

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

      <View style={styles.viewStyle}>

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


        <TouchableOpacity onPress={this.emailSignUpAsync}>
          <Button secondary rounded large style={styles.button}>
              <Text style={styles.lightText} >{prevPage}</Text>
          </Button>
        </TouchableOpacity>
      
        <Text>Or</Text>

        {/* <TouchableOpacity onPress={this.navigateToAdress}>
          <Button secondary rounded large style={styles.button}>
              <Text style={styles.lightText} >{prevPage}</Text>
          </Button>
        </TouchableOpacity>

        <Text>Or</Text> */}


      {/* 
        <TouchableOpacity onPress={this.facebookLoginAsync}>
          <Button primary rounded large style={styles.button}>
            <Ionicons
              size={30}
              color="#fff"  
              style={styles.icon}
              name='logo-facebook'
            />
            <Text style={styles.lightText} >Facebook {prevPage}</Text>
          </Button>
        </TouchableOpacity> */}

        <TouchableOpacity onPress ={this.googleLoginAsync}>
          <Button primary rounded large style={styles.button}>
            <Ionicons
              size={30}
              color="#fff"
              style={styles.icon}
              name='logo-google'
            />
            <Text style={styles.lightText} >Google {prevPage}</Text>
          </Button>
        </TouchableOpacity>
      </View>
    );
    }else{
      return(

        <View  style={styles.viewStyle}>
        {/* <View style={styles.container}>
            <TextInput
                placeholder= 'Email'
                underlineColorAndroid="transparent"
                autoCapitalize='none'
                autoCorrect={false}
                style={styles.TextInputStyle}
                onChangeText = {email => this.setState({email:email.trim()})}
                />
        </View> */}

      <View style={styles.container}>
          <TextInput
              placeholder= 'Email'
              underlineColorAndroid="transparent"
              autoCapitalize='none'
              autoCorrect={false}
              style={styles.TextInputStyle}
              onChangeText = {email => this.setState({email:email})}
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

        
      <TouchableOpacity onPress={this.emailLoginAsync}>
        <Button secondary rounded large style={styles.button}>
            <Text style={styles.lightText} >{prevPage}</Text>
        </Button>
      </TouchableOpacity>

      <Text>Or</Text>

    <TouchableOpacity onPress ={this.googleLoginAsync}>
      <Button primary rounded large style={styles.button}>
        <Ionicons
          size={30}
          color="#fff"
          style={styles.icon}
          name='logo-google'
        />
        <Text style={styles.lightText} >Google {prevPage}</Text>
      </Button>
    </TouchableOpacity>
 
    </View>
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
    height: 50,
    width: 300,
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
    width: 300,
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
    width: 300,
    margin:10,
    backgroundColor: "#f8f8f8",
},
alertContainer:{
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
}
});