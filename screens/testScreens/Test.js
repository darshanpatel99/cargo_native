import React from 'react';

import { GiftedChat } from 'react-native-gifted-chat';
// import firebase from '../Firebase';
import firebaseChat from '../../FirebaseChat';


class TestScreen extends React.Component {

  constructor(props) {
    super(props);
  }
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });

  state = {
    messages: [],
    senderAndRecieverId: '0zVVJrL8Pdb3ogpAmqV7oprwaah1'+firebaseChat.uid
  };

  get user() {
    return {
      // name: this.props.navigation.state.params.name,
      // email: this.props.navigation.state.params.email,
      // avatar: this.props.navigation.state.params.avatar,
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

export default TestScreen;