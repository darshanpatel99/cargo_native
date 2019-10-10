import React from 'react';
import {View, KeyboardAvoidingView, Platform, Text, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors.js';
import { GiftedChat } from 'react-native-gifted-chat';
import firebaseChat from '../../FirebaseChat';
import firebase from '../../Firebase'
import { Ionicons } from '@expo/vector-icons';

export default class ChatScreen extends React.Component {

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const owner = navigation.getParam('owner');
    const previousScreen = navigation.getParam('previousScreen')
    const sellerName = navigation.getParam('sellerName')
    let chatDocumentReferenceId = ''



    if(previousScreen == 'Details') {

      if(owner < firebaseChat.uid) {
        chatDocumentReferenceId = owner+firebaseChat.uid
      } else {
        chatDocumentReferenceId = firebaseChat.uid+owner
      }

      var currentLoggedInUID = firebaseChat.uid;

      firebase.firestore().collection("Users")
      .where('UID', '==', currentLoggedInUID)
      .get()
      .then(querySnapshot => {
        console.log('profile image querysnap -->')
        console.log(querySnapshot.docs[0].data().ProfilePicture)
        this.setState({ post_user_name: querySnapshot.docs[0].data().ProfilePicture });
      });
      
      this.state = {
        messages: [],
        senderAndRecieverId: chatDocumentReferenceId,
        buyerName: firebaseChat.userDisplayName,
        sellerName,
        
      };
      //this.firebaseGetSellerName();

    } else if (previousScreen == 'Home') {

      const completeChatThread = navigation.getParam('completeChatThread');
      var reciverId = completeChatThread.reciverId;
      var senderId = completeChatThread.senderId;
      var senderName = completeChatThread.senderName;

      if(reciverId < senderId) {
        chatDocumentReferenceId = reciverId+senderId
      } else {
        chatDocumentReferenceId = senderId+reciverId
      }

      var currentLoggedInUID = firebaseChat.uid;

      firebase.firestore().collection("Users")
      .where('UID', '==', currentLoggedInUID)
      .get()
      .then(querySnapshot => {
        console.log('profile image querysnap -->')
        console.log(querySnapshot.docs[0].data().ProfilePicture)
        this.setState({ post_user_name: querySnapshot.docs[0].data().ProfilePicture });
      });
      
      //alert(reciverId)
      //chatDocumentReferenceId = 
      //alert(chatDocumentReferenceId)
      this.state = {
        messages: [],
        senderAndRecieverId: chatDocumentReferenceId,
        sellerName: senderName,
      };

    }
    else {
      const completeChatThread = navigation.getParam('completeChatThread')
      console.log(JSON.stringify(completeChatThread.reciverId))
      var reciverId = completeChatThread.reciverId;
      // var chattingWith = completeChatThread.chat; 
      // this.setState({chattingWith})
      //senderId = firebaseChat.uid;
      console.log('THIS IS RECIVER ID ' + reciverId)
      if(reciverId < firebaseChat.uid) {
        chatDocumentReferenceId = reciverId+firebaseChat.uid
      } else {
        chatDocumentReferenceId = firebaseChat.uid+reciverId
      }
      
      //alert(chatDocumentReferenceId)
      //chatDocumentReferenceId = 
      //alert(chatDocumentReferenceId)
      //const profileImage = navigation.getParam('profileImage');

    var currentLoggedInUID = firebaseChat.uid;

    firebase.firestore().collection("Users")
    .where('UID', '==', currentLoggedInUID)
    .get()
    .then(querySnapshot => {
      console.log('profile image querysnap -->')
      console.log(querySnapshot.docs[0].data().ProfilePicture)
      this.setState({ post_user_name: querySnapshot.docs[0].data().ProfilePicture });
    });
     

      this.state = {
        messages: [],
        senderAndRecieverId: chatDocumentReferenceId,
        sellerName: firebaseChat.userDisplayName,
      
      };


    }
  //this._unsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  }

  static navigationOptions = ({ navigation }) => ({

    title: navigation.state.params.completeChatThread.chat || 'Chat',
    headerLeft: (
      <TouchableOpacity onPress={ () => navigation.navigate(navigation.state.params.previousScreen)}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Ionicons name={Platform.OS === "ios" ? `ios-arrow-back` : `md-arrow-back`} color={Colors.primary} style={{ marginLeft: 5 , marginTop: 10, fontSize:30}} />
            {/* <Text style={{ color:Colors.primary, marginLeft: 5 , marginTop: 10, fontSize:23, marginRight:10}}>{navigation.state.params.previousScreen}</Text> */}
          </View>
      </TouchableOpacity>
    ),
  });

  componentDidMount() {

    const { navigation } = this.props;
    
    this.focusListener = navigation.addListener('didFocus', () => { 
    //checking the current user and setting uid
    let user = firebase.auth().currentUser;

  });
  }


  get user() {
    return {
      // name: this.props.navigation.state.params.name,
      // email: this.props.navigation.state.params.email,
      // avatar: this.props.navigation.state.params.avatar,
      // buyerName: this.state.buyerName,
      // sellerName: this.state.sellerName,
      // reciverID: this.state.owner,
      senderId: firebaseChat.uid ,
      _id: firebaseChat.uid, // need `fo`r gifted-chat
      avatar: this.state.post_user_name,
    };
  }


  render() {
    return (
      <View style ={{flex: 1}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={firebaseChat.send}
          user={this.user}
          showAvatarForEveryMessage ={true}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={80}/> : <View></View> }
      </View>

    );
    
  }
  


  //passing the uid and seller id to grab the message thread
  componentWillMount() {
    firebaseChat.passUIDToFirebaseRef(this.state.senderAndRecieverId);
  }

  componentDidMount() {
    firebaseChat.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
  componentWillUnmount() {
    firebaseChat.refOff();
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
}
