
import * as firebase from 'firebase';

export default function AddUser(data) {
    
    //Fuction that adds product to the database.
    var userCollectionReference = firebase.firestore().collection('Users').doc(data.UID);

    console.log('User Added');  
     
    return userCollectionReference.set(data);  
}
