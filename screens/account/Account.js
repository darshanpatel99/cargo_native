import React, {Component} from 'react';
import { ScrollView, StyleSheet,View,Image,Text,TouchableHighlight,Dimensions} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import MainButton from "../../components/theme/MainButton"; //components\theme\MainButton.js
import Colors from "../../constants/Colors.js";
import firebase from '../../Firebase.js';
import { Item,Button,Badge} from "native-base";
import SmallButtonComponent from '../../components/theme/SmallButtonComponent.js';
import Header from './../../components/headerComponents/Header';

export default class AccountScreen extends React.Component {

  constructor(props){
    super(props);
    this.ref = firebase.firestore().collection('Users').doc('rh1cFdoEdRUROJP36Ulm');
    this.state = {
    data: {},
    name:'',
    globalAddress:'',
    User:null,
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
  this.setState({ User: user });
};

  //Function to logo out user
  async logoutAsync(props) {
    try {
      await firebase.auth().signOut();
      
    
    } catch ({ message }) {
      alert(message);
    }
  }

  async logoutAsync() {
    try {
      await firebase.auth().signOut();
      props.navigation.navigate('Account');
    } catch ({ message }) {
      alert(message);
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

  render() {
    if(this.state.User != null){
        console.log('User is logged in, showing the user information');
        return (
          <View style={styles.screen}> 

              <View style={styles.pictureHolder}>                  
                <View style={styles.imageView}>
                  <Image source={{uri:this.state.data.ProfilePicture}} style={styles.profilePicture}/>
                </View>               
                <View style={styles.settingsButton}>
                  <Button icon transparent>
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
                    <Text style={styles.info}>{this.state.data.PhoneNumber}</Text>
                    <Text style={styles.info}>{this.state.data.Email}</Text>
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
                <View style={styles.viewStyle}>
                <Button full large primary rounded> 
                  <Text onPress={this.logoutAsync}>Log Out</Text>
                  </Button>
                </View>
              </View>

          </View>
      );
    }
    else{
      console.log('User not logged in');
        return (
          <View style={{ height: '100%' }}>
            <Header />
            <Text>Hello Hello</Text>
            {/* <Button
              title='Go to Change Password Screen'
              onPress={() => this.props.navigation.navigate('ChangePassword')}
            />
            <Button
              title='Go to Change Login Screen'
              onPress={() => this.props.navigation.navigate('Login')}
            />
            <Button
              title='Go to Change Sign Up Screen'
              onPress={() => this.props.navigation.navigate('SignUp')}
            />

            <Button
              title='Go to account info'
              onPress={() => this.props.navigation.navigate('AccountInfo')}
            />
            */}
            <View style={styles.viewStyle}>
            <Button full large primary rounded> 
              <Text onPress={() => this.props.navigation.navigate('SignUp')}>Login</Text>
            </Button>

            <Button full large primary rounded> 
              <Text onPress={() => this.props.navigation.navigate('SignUp')}>SignUp</Text>
            </Button>

            <Button full large primary rounded> 
              <Text onPress={() => this.props.navigation.navigate('AccountInfo')}>Account Info</Text>
            </Button>
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
    marginBottom:0,
    marginLeft:40,
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