import React, { Component } from "react";
import { View, StyleSheet,Text,TextInput,Dimensions } from "react-native";
import MainButton from "../../components/theme/MainButton";
import Colors from "../../constants/Colors.js";
import { clear } from "sisteransi";
import { Button } from "native-base";
import * as WebBrowser from 'expo-web-browser';
import {Linking} from 'expo';
import firebase from '../../Firebase';
import AddUser from '../../functions/AddUser';
import {StackActions,  NavigationActions } from 'react-navigation';


const captchaUrl = `https://cargo-488e8.firebaseapp.com/CarGoCaptcha.html?appurl=${Linking.makeUrl('')}`;


 


export default class SignUpScreen extends Component {
  constructor(props){
    super(props);

    this.state ={
      phoneNumber:'',
      remove:true,
      buttonOn:false,           
      user: undefined,
      phone:'',
      confirmationResult: undefined,
      code: '',
      Token: '',
      valid:false,
      emailRegistration:false,
      nameRegistration:false,
      userName:'',
      email:'',
      country:'',
      city:'',
      street:'',
      UID:'',
    };
    this.firebaseRef = firebase.firestore().collection('Users');
    this.captcahRef = firebase.firestore().collection('reCaptcha').doc('YksTcYBgjxD6Oj26zmzl');
      //things need to be bit more clear here
      this.captcahRef.onSnapshot((doc)=>{
       console.log(this.state.valid);
        if(this.state.valid){
          this.setState({valid:false, Token: doc.data().Token});
          this.onTokenReceived(this.state.Token);         
          console.log('Go the valid token');
        }
        else{
        this.setState({Token: doc.data().Token, valid:true});
        }
        console.log(this.state.Token);
     
    });
  }


nextButtonFunc =() =>{
  if(this.state.buttonOn){    
    return(
  <View>
    <Button full large primary rounded onPress={this.onPhoneComplete}>
      <Text style={[styles.buttonText,{color:'white'}]}>next</Text>
    </Button>
  </View>      
    )
  }
  else{
    return(
      <View>
        <Button full large rounded disabled>
          <Text style={[styles.buttonText,{color:'white'}]}>next</Text>
        </Button>
      </View>
    )        
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
          this.setState({UID:uid, user:user});
          
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

continueToNameReg = () => {
    this.setState({
        userName:'',
        nameRegistration:true,
    });
}

/**
 * Function Description: Called when the token is received 
 */
onTokenReceived = async (token) =>{
  
  console.log("Token has been received");
  const {phoneNumber} = this.state;
  //fake firebase.auth.ApplicationVerifier
  const captchaVerifier = {
      type: 'recaptcha',
      verify: () => Promise.resolve(token)
  }
  try {
      const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, captchaVerifier);
      console.log(confirmationResult);
      this.setState({confirmationResult});
  } catch (e) {
      console.warn(e);
  }
}
onPhoneComplete = async () => {
    let token = null
    
//    Linking.addEventListener('url', this.tokenListener);   
    console.log('opening web browser');
    await WebBrowser.openBrowserAsync(captchaUrl);
  //  Linking.removeEventListener('url', this.tokenListener); 


    // //for testing purposes
    // this.setState({confirmationResult:{
    //   "a": "hello",
    //   "verificationId": "AM5PThCwJWA469GCX2yeXD8QrV02CFEugCFgdYNhmH8fyaPQBTdCEnOQygiKGxPx205yC9YC7Vfg7O8WBouBJfINY0hOY9xzctVHfqL1lw-MsQ0M_J8lXscyUBhGk2tYXz8F9iZ_cLmT",
    // }});
}
onCodeChange = (code) => {
    this.setState({code});
}


onPhoneChange = (phone) => {
    this.setState({phone});
}



  hideDefault = () =>{
    if(this.state.remove){
      this.setState({
        remove:false,
        phoneNumber:'+',
        buttonOn:false,        
      })
    }
  }


  changeText =(phoneNumber) =>{
    //this.setState({phone:phoneNumber});
    //console.log(phoneNumber + '  and  '+ this.state.phoneNumber);
    if(this.state.phoneNumber.length>phoneNumber.length){
      this.removingText(phoneNumber);
    }else{
      this.textManager(phoneNumber);
    }     
  }

  textManager =(number)=>{
    if(this.state.phoneNumber.length==0){
      this.setState({
        phoneNumber:'+',
        buttonOn:false,
      })
    }

    if(this.state.phoneNumber.length==1){
      this.setState({
        phoneNumber: number+ ' (',
      })
    }
    else{
      if(this.state.phoneNumber.length==4){
        var temp = this.state.phoneNumber.substring(0,4);
        var str= number+'';
        var num = str.charAt(number.length-1)       
        this.setState({
          phoneNumber: temp + num,
        })      
      }

      if(this.state.phoneNumber.length==5){
        var temp = this.state.phoneNumber.substring(0,5);
        var str= number+'';
        var num = str.charAt(number.length-1)       
        this.setState({
          phoneNumber: temp + num,
        })        
      }
      
      if(this.state.phoneNumber.length==6){
        var temp = this.state.phoneNumber.substring(0,6);
        var str= number+'';
        var num = str.charAt(number.length-1)       
        this.setState({
          phoneNumber: temp + num + ') ',
        })        
      }

      if(this.state.phoneNumber.length>8 && this.state.phoneNumber.length <12){


        var str= number+'';
        var num = str.charAt(number.length-1)        
        this.setState({
          phoneNumber: this.state.phoneNumber + num,
        })         
      }

      if(this.state.phoneNumber.length ==11){
        var str= number+'';
        var num = str.charAt(number.length-1)        
        this.setState({
          phoneNumber: this.state.phoneNumber + num + '-',
        })        
      }

      if(this.state.phoneNumber.length>12 && this.state.phoneNumber.length <17){


        var str= number+'';
        var num = str.charAt(number.length-1)        
        this.setState({
          phoneNumber: this.state.phoneNumber + num,
        })         
      }
      
      if(this.state.phoneNumber.length==16){


        var str= number+'';
        var num = str.charAt(number.length-1)        
        this.setState({
          phoneNumber: this.state.phoneNumber + num,
          buttonOn:true,
        })         
      }

    }    
  }

  removingText=(number)=>{
    //console.log(number.length);
    if(number.length==12){
      this.setState({
        phoneNumber:number.substring(0,11),        
      })      
    }
    else{

      if(number.length==8){
        this.setState({
          phoneNumber:number.substring(0,6),        
        })      
      }
      else{
        
        
        if(number.length==3){
          this.setState({
            phoneNumber:'+',        
          })      
        }
        else{
          this.setState({
            phoneNumber:number,
            buttonOn:false,
          })
        }
      }
    }
       
  }

  nextButton =()=>{
    //console.log('its stoped')

    if(this.state.phoneNumber>9)

    this.setState({
      buttonOn:true,
    })
  }

  confirmButton = () =>{
    if(this.state.code.length==6){    
      return(
      <View>
        <Button full large primary rounded onPress={this.onSignIn}>
          <Text style={[styles.buttonText,{color:'white'}]}>next</Text>
        </Button>
      </View>      
        )
      }
    else{
      return(
          <View>
            <Button full large rounded disabled>
              <Text style={[styles.buttonText,{color:'white'}]}>next</Text>
            </Button>
          </View>
      )        
    }    
  }


  phoneReg =()=>{
    return(
      <View style={styles.viewStyle}>
      <Text style={styles.textStyle}>
            Enter phone number!
        </Text>
        <View style={styles.inputViewStyle}>
            <TextInput
                style={styles.inputStyle}                
                editable={true}
                rejectResponderTermination={true}
                autoCompleteType='tel'
                onFocus={this.hideDefault}                
                onChangeText={this.changeText}
                value= {this.state.phoneNumber}
                keyboardType='phone-pad'
                caretHidden={true}
                clearButtonMode='while-editing'
                maxLength={17}
                enablesReturnKeyAutomaticaly={true}
                returnKeyType='done'
                onEndEditing={this.nextButton}
                placeholder='+0 000 000 0000 '                                               
            />
        </View>
        <View style={styles.buttonSize}>
          {this.nextButtonFunc()}                  
        </View>               
      </View>
    )
            
  }

  phoneConfirm =() =>{
    return(
      <View style={styles.viewStyle}>
          <Text style={styles.textStyle}>
              Enter verification code!
          </Text>
          <View style={styles.inputViewStyle}>
              <TextInput
                  style={styles.inputStyle}                
                  editable={true}               
                  onChangeText={this.onCodeChange}
                  value= {this.state.code}
                  keyboardType='phone-pad'
                  caretHidden={true}
                  clearButtonMode='while-editing'
                  maxLength={6}
                  enablesReturnKeyAutomaticaly={true}
                  returnKeyType='done'
                  placeholder='Code from SMS'                                               
              />
          </View>
          <View style={styles.buttonSize}>
            {this.confirmButton()}                  
          </View>       
        </View>
    )
  }

  nameReg =() =>{
     return(
      <View style={styles.viewStyle}>
          <Text style={styles.textStyle}>
              Enter your full name
          </Text>
          <View style={styles.inputViewStyle}>
              <TextInput
                  style={styles.inputStyle}                
                  editable={true}               
                  onChangeText={this.changeName}
                  value= {this.state.userName}
                  keyboardType='default'
                  caretHidden={false}
                  clearButtonMode='while-editing'
                  maxLength={30}
                  enablesReturnKeyAutomaticaly={true}
                  returnKeyType='done'
                  placeholder='First Last'                                               
              />
          </View>
          <View style={styles.buttonSize}>
            {this.proceedButton()}                  
          </View>       
        </View>
     )    
  }

  changeName =(name) =>{
    this.setState({
      userName:name,
      })
  }

  proceedButton =() =>{

    if(this.state.userName.length>0){
       return(
    <View>
      <Button full large primary rounded onPress={this.goToEmail}>
        <Text style={[styles.buttonText,{color:'white'}]}>go</Text>
      </Button>
    </View>      
      )
      }
      else{
        return(
          <View>
      <Button full large primary rounded disabled>
        <Text style={[styles.buttonText,{color:'white'}]}>go</Text>
      </Button>
    </View>
        )
                
      }
  }


  goToEmail =() =>{
    this.setState({
      email:'',
      emailRegistration:true,
    })
  }

  changeMail =(mail) =>{
    this.setState({
      email:mail,
    })
  }

  finish = () =>{

    if(this.state.email.length>0){
       return(
    <View>
      <Button full large primary rounded onPress={this.finishFunc}>
        <Text style={[styles.buttonText,{color:'white'}]}>finish</Text>
      </Button>
    </View>      
      )
      }
      else{
        return(
          <View>
        <Button full large rounded disabled>
          <Text style={[styles.buttonText,{color:'white'}]}>finish</Text>
        </Button>
    </View> 
        )
               
      }    
  }

 

  finishFunc =() =>{

    var data={
      ActiveProducts : [],
      BoughtProducts : [],
      Cart : [],
      City : '',
      Country : '',
      Email : this.state.email,
      FirstName : '',
      LastName : '',
      PhoneNumber : this.state.phoneNumber,
      ProfilePicture : '',
      SoldProducts : [],
      Street : [],
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

  emailReg = () =>{
    return(
      <View style={styles.viewStyle}>
          <Text style={styles.textStyle}>
              Enter your email address
          </Text>
          <View style={styles.inputViewStyle}>
              <TextInput
                  style={styles.inputStyle}                
                  editable={true}               
                  onChangeText={this.changeMail}
                  value= {this.state.email}
                  keyboardType='default'
                  caretHidden={false}
                  clearButtonMode='while-editing'
                  maxLength={100}
                  //enablesReturnKeyAutomaticaly={true}
                  //returnKeyType='done'
                  placeholder='cargo@cargo.com'                                               
              />
          </View>
          <View style={styles.buttonSize}>
            {this.finish()}                  
          </View>       
        </View>
     )
  }


  render() {

    if(this.state.emailRegistration){
      return(
        <View style={styles.viewStyle}>
        {this.emailReg()}
        </View>
      )
            
    }
    else{

    if(this.state.nameRegistration){
      return(
      <View style={styles.viewStyle}>
          {this.nameReg()}     
          </View> )       
    }
    else{
        // if(this.state.user){
        //   return (
        //     <View style={styles.viewStyle}>
        //       <Text style={styles.textStyle}>
        //           Enter that appers when user is true 
        //       </Text>
        //       <View style={styles.inputViewStyle}>
        //           <TextInput
        //               style={styles.inputStyle}                
        //               editable={true}
        //               rejectResponderTermination={true}
        //               autoCompleteType='tel'
        //               onFocus={this.hideDefault}                
        //               onChangeText={this.changeText}
        //               value= {this.state.phoneNumber}
        //               keyboardType='phone-pad'
        //               caretHidden={true}
        //               clearButtonMode='while-editing'
        //               maxLength={17}
        //               enablesReturnKeyAutomaticaly={true}
        //               returnKeyType='done'
        //               onEndEditing={this.nextButton}
        //               placeholder='+0 000 000 0000 '                                               
        //           />
        //       </View>
        //       <View style={styles.buttonSize}>
        //         {this.nextButtonFunc(this.state.buttonOn)}                  
        //       </View>       
        //     </View>
        //   )
        // }
        if(!this.state.confirmationResult)
        return (
          <View style={styles.viewStyle}>
          {this.phoneReg()}     
          </View>               
        )        
        else
        return (
          <View style={styles.viewStyle}>
          {this.phoneConfirm()}
          </View>        
          )

      }
    }


  }
}






const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    alignItems:'center',    
    justifyContent:'center',
    marginBottom:Dimensions.get('window').height*0.11,    
  },

  textStyle:{
    fontSize:30,
    fontWeight:'700',
    color:Colors.secondary,                  
  },

  inputViewStyle:{
    marginVertical:Dimensions.get('window').height*0.05,
    borderBottomColor:Colors.primary,
    borderBottomWidth:1,
    width:Dimensions.get('window').width*0.8,
  },

  inputStyle:{    
    textAlign:'center',
    justifyContent:'center',
    padding:5,
    fontSize:20,
    fontWeight:'300',
    color:'grey',        
  },

  buttonText:{
    fontSize:30,
    fontWeight:'500',    
  },

  buttonSize:{
    width: Dimensions.get('window').width*0.25,
  }
});
