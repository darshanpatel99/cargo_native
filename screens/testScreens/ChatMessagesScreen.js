import React from 'react';

import { GiftedChat } from 'react-native-gifted-chat';
// import firebase from '../Firebase';
import firebaseChat from '../../FirebaseChat';
import firebase from '../../Firebase'


export default class ChatScreen extends React.Component {

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const owner = navigation.getParam('owner');
    const previousScreen = navigation.getParam('previousScreen')
    const sellerName = navigation.getParam('sellerName')

    // this.state({owner: owner})

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
        owner: owner,
        sellerName
      };
      //this.firebaseGetSellerName();

    } else {
      const completeChatThread = navigation.getParam('completeChatThread')
      chatDocumentReferenceId = completeChatThread
      //alert(chatDocumentReferenceId)
      this.state = {
        messages: [],
        senderAndRecieverId: chatDocumentReferenceId,
        sellerName: firebaseChat.userDisplayName,
        // owner: owner
      };
    }
  }


  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });


  // firebaseGetSellerName(){
  //   var docRef = firebase.firestore().collection("Users").doc(this.state.owner);
  //   const sellerName= ''
  //   let that = this // here your variable declaration
  //   docRef.get().then(function(doc) {
  //       if (doc.exists) {
  //           console.log("Document data:", doc.data());
  //           sellerName= doc.data().FirstName
  //       } else {
  //           // doc.data() will be undefined in this case
  //           console.log("No such document!");
  //       }
  //       that.setState({sellerName:'test'})
  //   }).catch(function(error) {
  //       console.log("Error getting document:", error);
  //   });
  //   that.setState({sellerName: 'sortedHighscores'}); // gives error


  // }

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

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseChat.send}
        user={this.user}
      />
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
