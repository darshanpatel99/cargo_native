import React from 'react';
import {Text, View, FlatList, ScrollView, TouchableOpacity} from 'react-native';
import firebase from 'firebase'
import ChatCard from '../screens/testScreens/ChatCard'
import { withNavigation } from 'react-navigation';
import firebaseChat from '../FirebaseChat'



class ChatDyanmicFlatList extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            chatCardsArray: [],
            chats:{},
            filteredChats:{},
          };

    }

 
    componentWillUnmount() {
        firebaseChat.refOff();
    }
    

    componentDidMount(){
        this.setState({ loading: true });
        firebase.database().ref('Chat').on('value', snapshot => {
            this.setState({ loading: false });

            this.setState({snapshot: snapshot.val()})
            let chatCardsArray=[];
        for (var prop in snapshot.val()) {
            if (prop.includes(firebaseChat.uid)) {
                // do stuff
                newObj = {chat: prop}
                console.log(prop)
                chatCardsArray.push(newObj)
            }
        }

    this.setState({chatCardsArray: chatCardsArray})

        this.setState({snapshot: snapshot.val()})
    });    
}

goToChatScreen = (item) => {
   //alert(item.chat)
   console.log(item.chat)
   this.props.navigation.push('ChatMessagesScreen', {userID:this.state.userID, owner: this.state.owner, previousScreen: 'ChatDynamicFlatList', completeChatThread: item.chat})

}

    render(){
        return(
            <ScrollView style={styles.scrollContainer}>

            <FlatList
              data={this.state.chatCardsArray}
              renderItem={({item}) =>
              <View >
                <TouchableOpacity onPress={() => this.goToChatScreen(item)}>
                    <Text> { item.chat }</Text>
                </TouchableOpacity>
              </View>
              }
            />
            </ScrollView>
        )

        // return  (
        //     <View>
        //         <Text> {this.state.chats.chat}</Text>
        //     </View>
        // )
    }


}

const styles= {
    scrollContainer: {
        flex: 1,
        paddingBottom: 22
       }
}

export default ChatDyanmicFlatList;