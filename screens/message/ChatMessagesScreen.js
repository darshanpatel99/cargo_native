import React from 'react';
import {View, KeyboardAvoidingView, Platform, Text, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors.js';
import { GiftedChat } from 'react-native-gifted-chat';
import firebaseChat from '../../FirebaseChat';
import firebase from '../../Firebase'
import { Ionicons } from '@expo/vector-icons';
import {Entypo} from '@expo/vector-icons';
import ActionSheet from 'react-native-actionsheet'
import AwesomeAlert from 'react-native-awesome-alerts';
export default class ChatScreen extends React.Component {

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const owner = navigation.getParam('owner');
    const previousScreen = navigation.getParam('previousScreen')
    const sellerName = navigation.getParam('sellerName')
    let chatDocumentReferenceId = ''



    if(previousScreen == 'Details') {
      //alert('Came from Details screen')
      //const completeChatThread = navigation.getParam('completeChatThread')
      //console.log(JSON.stringify(completeChatThread.reciverId))
      // var reciverId = completeChatThread.reciverId;
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
        showAlert: false,
      };
      //this.firebaseGetSellerName();
      //firebaseChat.blockChatUser(chatDocumentReferenceId)
      var blockStatusExists= firebaseChat.checkChildExist(chatDocumentReferenceId)
     
      if(blockStatusExists == 'true') {
        //firebaseChat.blockChatUser(chatDocumentReferenceId, )
        if(firebaseChat.checkChildExist(chatDocumentReferenceId) == 'true'){
          this.showAlert();
        }

        console.log('Child Exists')
      } else {
        firebaseChat.blockChatUser(chatDocumentReferenceId, 'false');
      }

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
        showAlert: false,
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
        showAlert: false,
      };
      //alert(firebaseChat.checkStatusOfChat(chatDocumentReferenceId))

    }

    // firebaseChat.blockChatUser(chatDocumentReferenceId)
    // var blockStatus= firebaseChat.checkChildExist(chatDocumentReferenceId)
    // alert('BLOCK STATA'  + blockStatus)
  //this._unsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  }


  //passing the uid and seller id to grab the message thread
  componentWillMount() {
    firebaseChat.passUIDToFirebaseRef(this.state.senderAndRecieverId);
    var chatStatus = firebaseChat.checkStatusOfChat(this.state.senderAndRecieverId);
    if(chatStatus =='true' ){
      this.showAlert();
      this.setState({
        chatStatusIsBlocked: true
      })
    } else {
      this.setState({
        chatStatusIsBlocked: false
      })
      }

  }

  componentDidMount() {
    this.props.navigation.setParams({ _showActionSheet: this._showActionSheet });
    firebaseChat.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
  componentWillUnmount() {
    firebaseChat.refOff();
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
    this.props.navigation.navigate('Chat');
  };
  
  hideAlert2(){
    this.setState({
      showAlert: false
    });
  };


  static navigationOptions = ({ navigation }) => {
    return {

    title: navigation.state.params.completeChatThread.chat || 'Chat',
    headerLeft: (
      <TouchableOpacity onPress={ () => navigation.navigate(navigation.state.params.previousScreen)}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Ionicons name={Platform.OS === "ios" ? `ios-arrow-back` : `md-arrow-back`} color={Colors.primary} style={{ marginLeft: 5 , marginTop: 10, fontSize:30}} />
            {/* <Text style={{ color:Colors.primary, marginLeft: 5 , marginTop: 10, fontSize:23, marginRight:10}}>{navigation.state.params.previousScreen}</Text> */}
          </View>
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity onPress={navigation.getParam('_showActionSheet')}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Entypo name={Platform.OS === "ios" ? `dots-three-horizontal` : `dots-three-horizontal`} color={Colors.primary} style={{ marginRight: 5 , marginTop: 10, fontSize:30}} />
          </View>
      </TouchableOpacity>
    ),
    }
  };

  _showActionSheet = () =>{
    console.log('Function is called ***************')
    this.ActionSheet.show()
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


  blockTheUser(chatThreadId, status){
    firebaseChat.blockChatUser(chatThreadId, status);
    this.showAlert();
  }

  additionalOption(index){
    if (index == 0){
      firebaseChat.deleteChatThread(this.state.senderAndRecieverId);
      alert('Chat deleted')
      this.props.navigation.navigate('Chat', {refresh:'refresh'})
    }
    else if (index == 1){
      alert('Report User')
    }
    else if (index == 2){
      //alert('Block User');
      this.blockTheUser(this.state.senderAndRecieverId, 'true');
    }
  }

  unblockAdditionalOption(index){
    if (index == 0){
      firebaseChat.deleteChatThread(this.state.senderAndRecieverId);
      this.props.navigation.navigate('Chat')
    }
    else if (index == 1){
      alert('User Reported')
    }
    else if (index == 2){
      this.blockTheUser(this.state.senderAndRecieverId, 'false');
      this.setState({
        chatStatusIsBlocked: false
      })
      this.hideAlert2();
    }
  }


  render() {
    const {showAlert} = this.state;
    let ActionSheetStatus;
    if (this.state.chatStatusIsBlocked == true) {
      ActionSheetStatus = <ActionSheet
                      ref={o => this.ActionSheet = o}
                      //title={'Which one do you like ?'}
                      options={['Delete', 'Report User', 'Unblock User','cancel']}
                      cancelButtonIndex={3}
                      destructiveButtonIndex={1}
                      onPress={(index) => {this.unblockAdditionalOption(index)}}
                    />;
    } else { ActionSheetStatus = <ActionSheet
                      ref={o => this.ActionSheet = o}
                      //title={'Which one do you like ?'}
                      options={['Delete', 'Report User', 'Block User','cancel']}
                      cancelButtonIndex={3}
                      destructiveButtonIndex={1}
                      onPress={(index) => {this.additionalOption(index)}}
                    />;
    }

    return (
      <View style={styles.viewStyle}>
      <View style ={{flex: 1}}>
        {ActionSheetStatus}
      

        <GiftedChat
          messages={this.state.messages}
          onSend={firebaseChat.send}
          user={this.user}
          showAvatarForEveryMessage ={true}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={80}/> : <View></View> }
      </View>

      <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Alert!!"
            message="This chat has been blocked."
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="Go back"
            confirmButtonColor={Colors.primary}
            onCancelPressed={() => {
              this.hideAlert();
            }}
            onConfirmPressed={() => {
              this.hideAlert();
            }}
          />
      </View>

    );
    
  }
  


}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
}
