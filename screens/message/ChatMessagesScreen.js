import React from 'react';
import {View, KeyboardAvoidingView, Platform} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import firebaseChat from '../../FirebaseChat';
import firebase from '../../Firebase'
import AwesomeAlert from 'react-native-awesome-alerts';
export default class ChatScreen extends React.Component {

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const owner = navigation.getParam('owner');
    const previousScreen = navigation.getParam('previousScreen')
    const sellerName = navigation.getParam('sellerName')

    // this.state({owner: owner})
    let User = firebase.auth().currentUser;

    let chatDocumentReferenceId = ''

    if(previousScreen == 'ProductScreen') {

      if(owner < firebaseChat.uid) {
        chatDocumentReferenceId = owner+firebaseChat.uid
      } else {
        chatDocumentReferenceId = firebaseChat.uid+owner
      }
      
      this.state = {
        messages: [],
        senderAndRecieverId: chatDocumentReferenceId,
        buyerName: firebaseChat.userDisplayName,
        User,
        sellerName,
        showAlert: true,
      };
      //this.firebaseGetSellerName();

    } else {
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
      
      //chatDocumentReferenceId = 
      //alert(chatDocumentReferenceId)
      this.state = {
        messages: [],
        senderAndRecieverId: chatDocumentReferenceId,
        sellerName: firebaseChat.userDisplayName,
        User,
        showAlert: true,
      };
    }

 

  this._unsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  }


  static navigationOptions = ({ navigation }) => ({

    title: navigation.state.params.completeChatThread.chat || 'Chat',
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
    };
  }

  //listens to the change in auth state
  onAuthStateChanged = User => {
    // if the user logs in or out, this will be called and the state will update.
    // This value can also be accessed via: firebase.auth().currentUser
    this.setState({ User: User });
    //navigate to the account screen if the user is not logged in

  };



  render() {
    const {showAlert} = this.state;

    return (
      <View style ={{flex: 1}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={firebaseChat.send}
          user={this.user}
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
