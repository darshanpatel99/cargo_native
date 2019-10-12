import React from 'react';
import { View, FlatList, ScrollView, TouchableOpacity,Text} from 'react-native';
import firebase from 'firebase'
import firebaseChat from '../FirebaseChat'
import ChatCard from '../components/product/ChatCard'
import Spinner from 'react-native-loading-spinner-overlay'
import { Icon } from 'native-base';
import AwesomeAlert from 'react-native-awesome-alerts';
import Colors from '../constants/Colors';

class ChatDyanmicFlatList extends React.Component {

    constructor(props){
    super(props);
    this.state = {
        chatCardsArray: [],
        chats:{},
        filteredChats:{},
        firstNames:[],
        isChatEmpty:true,
        //loading:true,
        showAlert: false,
        };

        this.showAlert = this.showAlert.bind(this);

    }

    

    componentWillUnmount() {
        firebaseChat.refOff();
    }
    
      //get user details using uid
    getUserDetailsFromUid (){
        
        //var docRef = firebase.firestore().collection("Users").where("UID","==", this.state.chatCardsArray[i].chat[0]);
        const db = firebase.firestore();
        var turmarkers =[];

        var i=0;
        for (i =0; i<this.state.chatCardsArray.length; i++) {
           // console.log(this.getUserDetailsFromUid(chatCardsArray[i].chat[0]))
    
        db.collection("Users").where("UID","==", this.state.chatCardsArray[i].chat).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => { 
                var userName={'chat' : doc.data().FirstName, "reciverId": doc.data().UID, 'profImage' : doc.data().ProfilePicture}
                //var recieverId = {'recieverId' : this.state.chatCardsArray[i].chat}
                turmarkers.push(userName)
                this.setState({
                    firstNames:turmarkers
                });
             });
    

        });   
        
    }
        
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
                //alert(prop)
                newObj = {chat: prop}
                var str = prop;
                var res = str.split(firebaseChat.uid);
                if(res[0] == ""){
                    //alert(res[1]);
                    newObj = {chat: res[1]}
                } else {
                    //alert(res[0])
                    newObj = {chat: res[0]}
                }
                //newObj = {chat: res}
                chatCardsArray.push(newObj)

                this.setState({
                    isChatEmpty:false,
                })
            }
        }

        this.setState({chatCardsArray: chatCardsArray})

        this.setState({snapshot: snapshot.val()})
        this.getUserDetailsFromUid()
        // console.log('After this')
        // var i=0;
        // for (i =0; i<chatCardsArray.length; i++) {
        //     console.log(chatCardsArray[i].chat[0]);
        //    // console.log(this.getUserDetailsFromUid(chatCardsArray[i].chat[0]))
        //   }
    });    

}

    goToChatScreen = (item) => {
        this.props.navigation.push('ChatMessagesScreen', {userID:this.state.userID, owner: this.state.owner, previousScreen:'Chat', completeChatThread: item, profileImage:item.profImage})
    }

    _onLongPressButton = () => {
        this.showAlert();
    }

    showAlert(){
        this.setState({
            showAlert: true,
        });
    };

    hideAlert(){
        this.setState({
        showAlert: false
        });
    };

    deleteChat(){
        this.setState({
            showAlert: false
        });
    }

    blockUser(){
        this.setState({
            showAlert: false
        });
    }

    render(){

        const {showAlert} = this.state;

            if(this.state.isChatEmpty && !this.state.loading){
                return(
                  <View style={styles.nochats}>
                      <View style={styles.noChatBox}>
                          <Text style={styles.noChatText}>
                          {<Text style={styles.heading}>Hey!</Text>}  {<Icon type ="MaterialCommunityIcons" name ="human-greeting" style={{fontSize:30, color: '#FBA21C'}}/>} {"\n"}
                          You don't have any chats currently!!!{"\n"} 
                         </Text>
                      </View>
                    
                  </View>
                  
                )
               }
               else{

        return(
            <View style={styles.viewStyle}>
            <ScrollView style={styles.scrollContainer}>
                 <Spinner
            visible={this.state.loading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />

          

            <FlatList
              data={this.state.firstNames}
              renderItem={({item}) =>
              <View >
                <TouchableOpacity onPress={() => this.goToChatScreen(item)}>
                <View >
                    <ChatCard   title = {item.chat} profPic = {item.profImage} />
                </View>
                </TouchableOpacity>
              </View>
              }
            />
            </ScrollView>

            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title="Advance Option"
                //message="Please check your email :)"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Block User"
                confirmText="Delete Chat"
                confirmButtonColor= {Colors.primary}
                onCancelPressed={() => {
                this.blockUser();
                }}
                onConfirmPressed={() => {
                this.deleteChat();
                }}
                />
            </View>
        )

        // return  (
        //     <View>
        //         <Text> {this.state.chats.chat}</Text>
        //     </View>
        // )
    }
}


}

const styles= {
    scrollContainer: {
        flex: 1,
        paddingBottom: 22
       },

       spinnerTextStyle: {
        color: '#0000FF'
      },

       nochats:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:4,
        marginVertical:10,  
      },

    noChatBox:{
        //borderRadius:20,
             
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.5,
        // backgroundColor:"white",
    },
    noChatText:{
        fontSize:20,
        color:'grey',
        textAlign:'center',
        lineHeight:30,
    },

    heading:{
        fontSize:30,
    },
       viewStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
      },
}

export default ChatDyanmicFlatList;