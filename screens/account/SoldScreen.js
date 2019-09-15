import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator, ScrollView, FlatList} from 'react-native';
import {Button} from 'native-base'
import firebase from '../../Firebase.js'; //Firebase.js C:\User1\CarGoDev\Relevent1 CarGo\cargo-native-v1\Firebase.js
import ProductCardComponent from '../../components/product/ProductCardComponent'
import MainButton from '../../components/theme/MainButton'
import { withNavigation } from 'react-navigation';


const products = [];
export default class SoldScreen extends Component{
constructor(props){
    super(props);
    console.log("This is prop " + (props))

    const {navigation} = this.props;

    const id = navigation.getParam('id');
    
    this.state = {
        isLoading: true,
        products: [],
        key :'',
        sort: this.props.filtersAndSorts 
    };
    this.firebaseRef = firebase.firestore();
    this.query1 =  this.firebaseRef.collection('Products').where('Status', '==', 'sold').where('Owner' , '==' , id)
    this.query2 = this.firebaseRef.collection('Products').where('Owner' , '==' , id).where('BoughtStatus' , '==' , 'true')
    // this.ref = query1 || query2;
    //this.productsCollectionRef = firebase.firestore().collection('Products');
    this.unsubscribe = null;
    //this.loadCartItems = this.loadCartItems.bind(this); 
    
    // this.query1.get().then(this.onDocumentUpdate);
    // this.query2.get().then(this.onDocumentUpdate);
}


onDocumentUpdate = (querySnapshot) => {
  console.log('on collection update')
  
  querySnapshot.forEach((doc) => {
    const { AddressArray, Description, Name, Price, Thumbnail, Pictures, Category, Owner, BuyerID, Status, BoughtStatus } = doc.data();
      // console.log(typeof Pictures['0']);
    products.push({
      key: doc.id,
      doc,
      Name,
      Description,
      Owner,
      Price,
      Thumbnail,
      Pictures,
      Category,
      AddressArray,
      BuyerID,
      Status,
      BoughtStatus,
    });
  });
  this.setState({
    products,
    isLoading: false,
  },
 );
}

componentDidMount(prevProps) {
  this.unsubscribe = this.query1.onSnapshot(this.onDocumentUpdate);
  this.unsubscribe = this.query2.onSnapshot(this.onDocumentUpdate);
}


componentWillUnmount(){
  this.unsubscribe();
}


render(){

    if(this.state.isLoading){
        return(
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff"/>
          </View>
        )
      }
      return (
<View style ={styles.container}>
      <ScrollView style={styles.scrollContainer}>

      <FlatList
        data={this.state.products}
        renderItem={({item}) =>
        <View >
          <ProductCardComponent  BoughtStatus={item.BoughtStatus}  Status={item.Status}BuyerID={item.BuyerID} thumbnail={item.Thumbnail} pickupAddress={item.AddressArray} owner={item.Owner} id ={item.key} title = {item.Name} description = {item.Description} price = {item.Price}  pictures = {item.Pictures} />
        </View>
      }
      />

      </ScrollView>
      </View>
    );
}
}

const styles = {
container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: 'center'
   },
   item: {
     padding: 10,
     fontSize: 18,
     height: 44,
   },
scrollContainer: {
 flex: 1,
 paddingBottom: 22,
//  justifyContent:'center'
},
item: {
  padding: 10,
  fontSize: 18,
  height: 44,
},
activity: {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  alignItems: 'center',
  justifyContent: 'center'
},

}