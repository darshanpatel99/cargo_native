import React from 'react';
import {View,Text} from 'react-native';
import firebaseChat from '../../FirebaseChat';
import ChatDynamicFlatList from '../../handlers/ChatDynamicFlatList';
import firebase from 'firebase';
import AwesomeAlert from 'react-native-awesome-alerts';
import Colors from '../../constants/Colors';
import Spinner from 'react-native-loading-spinner-overlay';


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
      loading: false,
      isChatEmpty:true,
    };
  //checking the current user and setting uid
  let user = firebase.auth().currentUser;

  }
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });

  componentWillMount() {
    const { navigation } = this.props;
  }

  // loadChats(){
  //   let user = firebase.auth().currentUser;

  //   this.setState({ loading: true });
  //   firebase.database().ref('Chat').on('value', snapshot => {
  //     this.setState({ loading: false });

  //     this.setState({snapshot: snapshot.val()})

  //   for (var prop in snapshot.val()) {
  //     if (prop.includes(this.state.userId)) {
  //         // do stuff
  //         newObj = {chat: 'this is test'}
  //         console.log(prop)
  //         this.setState({filteredChats: newObj})
  //     }
  //   }

  //     this.setState({snapshot: snapshot.val()})
  //   });

  //   this._unsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  // }

  componentWillUnmount() {
    firebaseChat.refOff();
  }

  componentDidMount(){
    
    const { navigation } = this.props;
      
    this._unsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

    this.focusListener = navigation.addListener('didFocus', () => { 
      console.log('chat.js on foucus')
      //let user = firebase.auth().currentUser;

    //   this.setState({ loading: true });
    //   firebase.database().ref('Chat').on('value', snapshot => {
    //     this.setState({ loading: false });
  
    //     this.setState({snapshot: snapshot.val()})
  
    //   for (var prop in snapshot.val()) {
    //     if (prop.includes(this.state.userId)) {
    //         // do stuff
    //         newObj = {chat: 'this is test'}
    //         console.log(prop)
    //         this.setState({filteredChats: newObj})
    //     }
    //   }
  
    //     this.setState({snapshot: snapshot.val()})
    //   });


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

  // showChats =() =>{
    
  //   if(this.state.isChatEmpty && !this.state.loading){
  //    return(
  //      <View style={styles.nochats}>
  //        <Text style={{fontSize:20,color:'grey'}}>
  //         No chats yet
  //       </Text>
  //      </View>
       
  //    )
  //   }
  // }

  render() {

    const {showAlert} = this.state;

    if(this.state.User != null){ 
      return (
      <View style ={styles.containerStyle}>

        <Spinner
            visible={this.state.loading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        <ChatDynamicFlatList navigation = {this.props.navigation}/>
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
    spinnerTextStyle: {
    color: '#0000FF'
  },

  nochats:{
    flex:1,
     borderRadius:20,
     alignItems:'center',
     justifyContent:'center',
     shadowColor: "#000",
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.5,
     backgroundColor:"white",
  },
}

export default Chat;