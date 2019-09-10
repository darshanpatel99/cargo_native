import React from 'react';

import { GiftedChat } from 'react-native-gifted-chat';
// import firebase from '../Firebase';
import firebaseChat from '../../FirebaseChat';


export default class ChatScreen extends React.Component {

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const owner = navigation.getParam('owner');

    let chatDocumentReferenceId = ''
    if(owner < firebaseChat.uid) {
      chatDocumentReferenceId = owner+firebaseChat.uid
    } else {
      chatDocumentReferenceId = firebaseChat.uid+owner
    }

    this.state = {
      messages: [],
      owner,
      senderAndRecieverId: chatDocumentReferenceId
    };

  }


  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });


  

  get user() {
    return {
      // name: this.props.navigation.state.params.name,
      // email: this.props.navigation.state.params.email,
      // avatar: this.props.navigation.state.params.avatar,
      reciverID: this.state.owner,
      id: firebaseChat.uid + 'IQt2h8bEZYpyEFGYEmW6',
      _id: firebaseChat.uid, // need for gifted-chat
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
