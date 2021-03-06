import firebase from 'firebase';
import uuid from 'uuid';

const config = {
  apiKey: "AIzaSyB4amsAqkm2FRGAcYlPe2svkBs-w9vxFIQ",
  authDomain: "cargo-488e8.firebaseapp.com",
  databaseURL: "https://cargo-488e8.firebaseio.com",
  projectId: "cargo-488e8",
  storageBucket: "cargo-488e8.appspot.com",
  messagingSenderId: "572236256696",
  appId: "1:572236256696:web:297a96ed7048a797"
}

let recieverAndSenderId = ''

class FirebaseChat {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    } else {
      console.log("firebase apps already running...")
    }
  }

  login = async(user, success_callback, failed_callback) => {
    console.log("logging in");
    const output = await firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(success_callback, failed_callback);
  }

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        this.login(user);
      } catch ({ message }) {
        console.log("Failed:" + message);
      }
    } else {
      console.log("Reusing auth...");
    }
  };

  createAccount = async (user) => {
    firebase.auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(function() {
        console.log("created user successfully. User email:" + user.email + " name:" + user.name);
        var userf = firebase.auth().currentUser;
        userf.updateProfile({ displayName: user.name})
        .then(function() {
          console.log("Updated displayName successfully. name:" + user.name);
          alert("User " + user.name + " was created successfully. Please login.");
        }, function(error) {
          console.warn("Error update displayName.");
        });
      }, function(error) {
        console.error("got error:" + typeof(error) + " string:" + error.message);
        alert("Create account failed. Error: "+error.message);
      });
  }

  uploadImage = async uri => {
    console.log('got image to upload. uri:' + uri);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase
        .storage()
        .ref('avatar')
        .child(uuid.v4());
      const task = ref.put(blob);
    
      return new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          () => {
              /* noop but you can track the progress here */
          },
          reject /* this is where you would put an error callback! */,
          () => resolve(task.snapshot.downloadURL)
        );
      });
    } catch (err) {
      console.log('uploadImage try/catch error: ' + err.message); //Cannot load an empty url
    }
  }

  updateAvatar = (url) => {
    //await this.setState({ avatar: url });
    var userf = firebase.auth().currentUser;
    if (userf != null) {
      userf.updateProfile({ avatar: url})
      .then(function() {
        console.log("Updated avatar successfully. url:" + url);
        alert("Avatar image is saved successfully.");
      }, function(error) {
        console.warn("Error update avatar.");
        alert("Error update avatar. Error:" + error.message);
      });
    } else {
      console.log("can't update avatar, user is not login.");
      alert("Unable to update avatar. You must login first.");
    }
  }
     
  onLogout = user => {
    firebase.auth().signOut().then(function() {
      console.log("Sign-out successful.");
    }).catch(function(error) {
      console.log("An error happened when signing out");
    });
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get userDisplayName() {
    return (firebase.auth().currentUser.displayName)
  }

  get ref() {
    return firebase.database().ref('Chat/'+recieverAndSenderId);
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    const timestamp = new Date(numberStamp);

    const message = {
      id,
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  refOn = callback => {
      firebase.database().ref('Chat/'+recieverAndSenderId)
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
    }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  passUIDToFirebaseRef(uid){
    console.log('this is a test function to pass the uid in component will mount -> ' + uid);
    recieverAndSenderId = uid
  }

  getChatsRefOn = callback => {
    firebase.database().ref('Chat')
    .limitToLast(20)
    
    .on('value', snapshot => callback(this.parse(snapshot)));
  }

  getAllChats(userId) {
    var that = this
    var chatObjects= []
    var urlRef = firebase.database().ref('Chat');
    console.log('THIS IS USERID -- ' + userId)
    urlRef.once("value", function(snapshot) {
      snapshot.forEach(function(child) {
        if((child.key.endsWith(userId) || (child.key.startsWith(userId)))) {
          // console.log(child.key+": "+child.val());
          // console.log(JSON.stringify( child.val()))
          chatObjects.push(JSON.stringify( child.val()))
        }
      });
      //console.log('THese are chatobjects -- ..>' +chatObjects)
      return chatObjects
    });
  }
  
  //this function will delete chat thread if user choose to delete the chat
  deleteChatThread(deleteChatThreadId) {
        var urlRef = firebase.database().ref('Chat/'+deleteChatThreadId).remove();
  }

  blockChatUser(chatThreadId, userBlocked){
    firebase.database().ref('Chat/'+chatThreadId).child('ChatStatus').update({'Blocked' : userBlocked})
  }

  //checks if the chatstatus child exists int the realtime db
  checkChildExist(chatThreadId){
    var blockStatus= ''
    firebase.database().ref('Chat/'+chatThreadId).once('value', function(snapshot) {
      if (snapshot.hasChild('ChatStatus')) {
        //alert('exists');
        blockStatus = 'true'
      }else{
        //alert('doesnt exist')
        blockStatus='false'
      }
    });
    //alert(blockStatus)
    return blockStatus;
  }

  //checks if the chat is blocked
  checkStatusOfChat(chatThreadId){
    var currentChatStatus='';
    firebase.database().ref('Chat/'+chatThreadId).once('value', function(snapshot){
      var data = snapshot.val();
      //console.log(JSON.stringify(data.ChatStatus.Blocked))
      currentChatStatus= data.ChatStatus.Blocked
    })
    return currentChatStatus;
  }



  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
    
      const message = {
        text,
        user,
        createdAt: this.timestamp,
    
      };
      this.ref.push(message);
    }
  };

  refOff() {
    this.ref.off();
  }
}

const firebaseChat = new FirebaseChat();
export default firebaseChat;
