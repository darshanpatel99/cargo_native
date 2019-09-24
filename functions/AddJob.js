/**
 * Function Description: Create a new job everytime transaction get completed
 */

import * as firebase from 'firebase';

export default function AddJob(data) {
    
    //Fuction that adds product to the database.
    var jobsCollectionReference = firebase.firestore().collection('Jobs');

    console.log('New Job has been created');
    return jobsCollectionReference.add(data);   
}