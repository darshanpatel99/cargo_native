import firebase from 'firebase';

class FirebaseSDK {
  constructor() {
    if (!firebase.apps.length) {
      //avoid re-initializing
      firebase.initializeApp({
        apiKey: "AIzaSyB4amsAqkm2FRGAcYlPe2svkBs-w9vxFIQ",
        authDomain: "cargo-488e8.firebaseapp.com",
        databaseURL: "https://cargo-488e8.firebaseio.com",
        projectId: "cargo-488e8",
        storageBucket: "cargo-488e8.appspot.com",
        messagingSenderId: "572236256696",
        appId: "1:572236256696:web:297a96ed7048a797"
      });
    }
  }
  login = async (user, success_callback, failed_callback) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  };
}
const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;