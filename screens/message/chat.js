import React from 'react';
import {View} from 'react-native';
import firebaseChat from '../../FirebaseChat';
import ChatDynamicFlatList from '../../handlers/ChatDynamicFlatList';
import firebase from 'firebase';
import AwesomeAlert from 'react-native-awesome-alerts';
import Colors from '../../constants/Colors';


let testObj ={}
class Chat extends React.Component {

  constructor(props) {
    super(props);
    // let chatObjects = this.getAllChats(firebaseChat.uid);
    this.state = {
      messages: [],
      chats:{},
      filteredChats:{},
      userId: firebaseChat.uid,
      showAlert: true,
      User:null,
    };
  //checking the current user and setting uid
  let user = firebase.auth().currentUser;
  
  }
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });

  componentWillMount() {
    //let chatObjects = firebaseChat.getAllChats(firebaseChat.uid);
    //this.setState({chats: chatObjects})
  }
  componentWillUnmount() {
    firebaseChat.refOff();
  }

  componentDidMount(){
    
    const { navigation } = this.props;
      
    this.focusListener = navigation.addListener('didFocus', () => { 

      let user = firebase.auth().currentUser;

      this.setState({ loading: true });
      firebase.database().ref('Chat').on('value', snapshot => {
        this.setState({ loading: false });
  
        this.setState({snapshot: snapshot.val()})
  
      for (var prop in snapshot.val()) {
        if (prop.includes(this.state.userId)) {
            // do stuff
            newObj = {chat: 'this is test'}
            console.log(prop)
            this.setState({filteredChats: newObj})
        }
      }
  
        this.setState({snapshot: snapshot.val()})
      });

      this._unsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

    });
    
  }

  //listens to the change in auth state
  onAuthStateChanged = user => {
    // if the user logs in or out, this will be called and the state will update.
    // This value can also be accessed via: firebase.auth().currentUser
    if (user != null){
      if(user.emailVerified){ // note difference on this line
        this.setState({ User: user});
      }
    }
    else{
      this.setState({ User: null});
    }
  };

  showAlert(){
    this.setState({
      showAlert: true,
      
    });
  };

  hideAlert(){
    const { navigate } = this.props.navigation;
    this.setState({
      showAlert: true
    });
    navigate('Account');
  };



  render() {

    const {showAlert} = this.state;

    if(this.state.User != null){
      return (
      <View style ={styles.containerStyle}>
        <ChatDynamicFlatList chats = {this.state.filteredChats} navigation = {this.props.navigation}/>
      </View>
    );
    }

    else{
      return (
        <View style={styles.container}>
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Alert"
            message="Please login first!"
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="Go to login!!"
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



}

const styles = {
  containerStyle: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
}

export default Chat;