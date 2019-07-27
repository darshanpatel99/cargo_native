import React, {Component} from 'react';
import {Text, View, Button, TouchableOpacity} from 'react-native';
import firebase from '../Firebase.js';


export default class CartHandler extends Component {

    constructor(props){
        super(props);
        console.log("This is prop " + (props))
        
        this.state = {
            isLoading: true,
            products: [],
            key :'',
            sort: this.props.filtersAndSorts
        };
        this.ref = firebase.firestore().collection('Products').orderBy('Price');
        this.unsubscribe = null;


    }
    async getMarkers() {
        const markers = [];
        await firebase.firestore().collection('events').get()
          .then(querySnapshot => {
            querySnapshot.docs.forEach(doc => {
            markers.push(doc.data());
          });
        });
        return markers;
      }

    async onPress (){
        console.log('pull items from firebase trigggg..')
        let test = ['BCduc6QJLgBMfK7tRCrb', 'DZpb4ydAcp8j01hINdLq'];
        let products= []
        // this.newRef = firebase.firestore().getAll(...test);
        // console.log(newRef)

        await firebase.firestore().collection('Products').get()
              .then(querySnapshot => {
                querySnapshot.docs.forEach(doc => {
                    if(test.includes(doc.id)) {
                        const { Description, Name, Price, Thumbnail, Pictures } = doc.data();                        
                        markers.push(doc.data());
                    }
              });
            });
            console.log(products)
            this.setState({
                products,
                isLoading: false,
             });
            return products;
          }


    render(){
    return (
        <TouchableOpacity
                onPress={this.onPress}>
        <Text> Touch Here </Text>
        </TouchableOpacity>    
        );
    }
}