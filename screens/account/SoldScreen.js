import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator, ScrollView, FlatList} from 'react-native';
import {Button} from 'native-base'
import firebase from '../../Firebase.js'; //Firebase.js C:\User1\CarGoDev\Relevent1 CarGo\cargo-native-v1\Firebase.js
import ProductCardComponent from '../../components/product/ProductCardComponent'
import MainButton from '../../components/theme/MainButton'
import { withNavigation } from 'react-navigation';

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
    this.ref =  firebase.firestore().collection('Products').where('Status', '==', 'sold').where('Owner' , '==' , id);
    //this.productsCollectionRef = firebase.firestore().collection('Products');
    this.unsubscribe = null;
    //this.loadCartItems = this.loadCartItems.bind(this);        
}

componentDidMount(prevProps) {

    this.unsubscribe = this.ref.get().then(this.onDocumentUpdate);

}



onDocumentUpdate = (querySnapshot) => {
  console.log('on collection update')
  const products = [];
  querySnapshot.forEach((doc) => {
    const { AddressArray, Description, Name, Price, Thumbnail, Pictures, Category, Owner, BuyerID, Status} = doc.data();
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
      Status
    });
  });
  this.setState({
    products,
    isLoading: false,
  },
 );
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
          <ProductCardComponent Status={item.Status}BuyerID={item.BuyerID} thumbnail={item.Thumbnail} pickupAddress={item.AddressArray} owner={item.Owner} id ={item.key} title = {item.Name} description = {item.Description} price = {item.Price}  pictures = {item.Pictures} />
        </View>
      }
      />

      </ScrollView>
      {/* <View style={{flexDirection: 'row', justifyContent:'center'}}>
          <MainButton title= 'Edit List'/>
        </View> */}
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