import React from 'react';
import {Text, View, FlatList, ScrollView} from 'react-native';

import ChatCard from '../screens/testScreens/ChatCard'


export default class ChatDyanmicFlatList extends React.Component {

    constructor(props){
        super(props);

        this.state={
            chats: this.props.chats
        }
    }


    render(){
        return(
            <ScrollView style={styles.scrollContainer}>

            <FlatList
              data={this.state.chats}
              renderItem={({item}) =>
              <View >
                {/* <ChatCard createdAt = {item.createdAt}  /> */}
                <Text> { item.createdAt }</Text>
              </View>
              }
            />
            </ScrollView>
        )
    }


}

const styles= {
    scrollContainer: {
        flex: 1,
        paddingBottom: 22
       }
}