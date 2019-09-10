import React from 'react';

import {Text, View, Button} from 'react-native';
import firebaseChat from '../../FirebaseChat';
import ChatDynamicFlatList from '../../handlers/ChatDynamicFlatList';
import firebase from 'firebase';


let testObj ={}
class TestScreen extends React.Component {

  constructor(props) {
    super(props);
    // let chatObjects = this.getAllChats(firebaseChat.uid);
    

    this.state = {
      messages: [],
      chats:{},
    };
    this.getAllChats = this.getAllChats.bind(this)
    this.getUserChatThread = this.getUserChatThread.bind(this)    
    console.log(this.getAllChats(firebaseChat.uid))
    

  }
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });


  componentWillMount() {


    //let chatObjects = firebaseChat.getAllChats(firebaseChat.uid);
    //this.setState({chats: chatObjects})
    
  }


  getUserChatThread(){
    const userId = firebaseChat.uid
    const testObj = this.state.chats;
    console.log('User ID --> '+userId)
    console.log('Test object -- > ' +  Object.keys(testObj))
    if(Object.keys(testObj).includes(userId)) {
      console.log('It exista')
    }
  }

  componentWillUnmount() {
    firebaseChat.refOff();
  }

  componentDidMount(){
      //console.log('TEST obj == > ' + JSON.stringify(this.state.chats))
  }

  getAllChats(userId) {

    var urlRef = firebase.database().ref('Chat');
    let chatObjects=[];


    urlRef.once("value").then((snapshot) =>  {

      //this.setState({chats : snapshot})
      //  snapshot.forEach(function(child) {
      //   if((child.key.endsWith(userId) || (child.key.startsWith(userId)))) {
      //     // console.log(child.key+": "+child.val());
      //     // console.log(JSON.stringify( child.val()))
      //     chatObjects.push(JSON.stringify( child.val()))
      //   }
    
      // });

      this.setState({chats: snapshot.val()})

      return chatObjects

      
    });

  
  }

  render() {
    return (
      <View style ={styles.containerStyle}>
        {/* <ChatDynamicFlatList chats = {this.state.chats}/> */}
        <Button
          title="Press me"
          onPress={this.getUserChatThread}
        />

      </View>
    );
  }



}

const styles = {
  containerStyle: {
    flex: 1,


  }
}

export default TestScreen;