
import * as firebase from 'firebase';

export default function PostTransaction(data) {
    
    //Fuction that adds transaction to the database.
    var TransactionCollectionReference = firebase.firestore().collection('ProcessedTransactions');

    console.log('Transaction Posted');
    return TransactionCollectionReference.add(data);   
}
