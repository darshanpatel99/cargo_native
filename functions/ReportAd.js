import * as firebase from 'firebase';

export default function ReportAd(data) {
    
    //Fuction that adds product to the database.
    var productCollectionReference = firebase.firestore().collection('FlaggedItems');

    console.log('Product Posted');
    return productCollectionReference.add(data);   
}
