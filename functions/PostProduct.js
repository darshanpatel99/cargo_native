
import * as firebase from 'firebase';

export default function PostProduct(data) {
    
    //Fuction that adds product to the database.
    var productCollectionReference = firebase.firestore().collection('Products');

    console.log('Product Posted');
    return productCollectionReference.add(data);   
}
