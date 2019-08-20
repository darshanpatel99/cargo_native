import React, { Component } from "react";
import { View, StyleSheet,Text,TextInput,Dimensions } from "react-native";

//Import related to Fancy Buttons
import { Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors.js";
import { clear } from "sisteransi";
import * as WebBrowser from 'expo-web-browser';
import {Linking} from 'expo';
import firebase from '../../Firebase';
import AddUser from '../../functions/AddUser';

//importing packages related to the sign in
import * as Facebook from 'expo-facebook';
import {Google} from 'expo';




export default class SignUpScreen extends Component {
  FacebookApiKey= '2872116616149463';

  constructor(props){
    super(props);

    //creating the firebase reference for the users collection
    this.firebaseRef = firebase.firestore().collection('Users');

    this.state ={
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
    // if the user logs in or out, this will be called and the state will update.
    // This value can also be accessed via: firebase.auth().currentUser
    this.setState({ user });
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
      alert('You got looged in with google');
      return accessToken;
    }
  }catch({message}){
    alert('login' + message);
  }
}

//Google Login Async function
googleLoginAsync = async () => {
  console.log('in loginAsync() method');
  // First we login to facebook and get an "Auth Token" then we use that token to create an account or login. This concept can be applied to github, twitter, google, ect...
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
                  this.props.navigation.navigate('Account');
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
      ProfilePicture : this.state.profilePic,
      SoldProducts : [],
      Street : '',
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
    // this.props.navigation.dispatch(resetAction);
    this.props.navigation.navigate('Account');

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
    return (
      <View style={styles.viewStyle}>
        <Button primary rounded large style={styles.button}>
            <Ionicons
              size={30}
              color="#fff"
              style={styles.icon}
              name='logo-facebook'
            />
            <Text style={styles.lightText} onPress={this.facebookLoginAsync}>Facebook SignUp</Text>
          </Button>
          <Button primary rounded large style={styles.button}>
            <Ionicons
              size={30}
              color="#fff"
              style={styles.icon}
              name='logo-google'
            />
            <Text style={styles.lightText} onPress ={this.googleLoginAsync}>Google SignUp</Text>
          </Button>

      </View>
    );
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
  }
});

