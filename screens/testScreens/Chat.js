import React from 'react';

import { GiftedChat } from 'react-native-gifted-chat';
import firebase from '../Firebase';

export default class Chat extends React.Component {
  state = {
    messages: [],
  };
  componentWillMount() {

  }
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(message) => {
          firebase.sendMessage(message);
        }}
        user={{
          _id: firebase.getUid(),
          name: this.props.name,
        }}
      />
    );
  }
  componentDidMount() {
    firebase.loadMessages((message) => {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, message),
        };
      });
    });
  }
  componentWillUnmount() {
    firebase.closeChat();
  }
}

Chat.defaultProps = {
  name: 'John Smith',
};

Chat.propTypes = {
  name: React.PropTypes.string,
};