import * as firebase from 'firebase';


/*
Function Description: Function to initialize the firebase.
*/
export default function Firebase() {

let config = {
    apiKey: "AIzaSyB4amsAqkm2FRGAcYlPe2svkBs-w9vxFIQ",
    authDomain: "cargo-488e8.firebaseapp.com",
    databaseURL: "https://cargo-488e8.firebaseio.com",
    projectId: "cargo-488e8",
    storageBucket: "cargo-488e8.appspot.com",
    messagingSenderId: "572236256696",
    appId: "1:572236256696:web:297a96ed7048a797"
}
firebase.initializeApp(config);
console.log('Firebase initialized');
}


/*
Function Description: Post Product to firebase

How to use it:
--------------

make a json object like
    data:{
    name:"BMW GTR 300",
    Desciption: " This is a brand new car."

    and pass that object to the function like:
    -----------------------------------------

    import {post} from './Functions/Firebase.js'

    post.PostProduct(data);

    }

*/
export default function PostProduct(data) {
    
    //Fuction that adds product to the database.
    var productCollectionReference = firebase.firestore().collection('Products');

    console.log('Product Posted');
    return productCollectionReference.add(data);   
}



//
export default function GetSpecificProductData(productID) {
    
    var productRef = firebase.firestore().collection('Products').doc(productID);
    
    productRef.onSnapshot(doc => {
        this.data = doc.data();
        pictures = JSON.stringify(this.data.Pictures[0]);
          console.log(pictures);
      });

}