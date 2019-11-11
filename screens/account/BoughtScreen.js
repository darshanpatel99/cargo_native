import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator, ScrollView, FlatList} from 'react-native';
import firebase from '../../Firebase.js'; //Firebase.js C:\User1\CarGoDev\Relevent1 CarGo\cargo-native-v1\Firebase.js
import ProductCardComponent from '../../components/product/ProductCardComponent'


export default class BoughtScreen extends Component{
constructor(props){
    super(props);
    console.log("This is prop " + (props))

    const {navigation} = this.props;

    const id = navigation.getParam('id');
    
    this.state = {
        isLoading: true,
        products: [],
        key :'',
        sort: this.props.filtersAndSorts, 
    };
    this.ref = firebase.firestore();
    this.collectionRef = firebase.firestore().collection('Products').where('Status', '==', 'bought').where('Owner' , '==' , id);
    this.unsubscribe = null;
}

onDocumentUpdate = (querySnapshot) => {
  console.log('on collection update')
  const products = [];
  querySnapshot.forEach((doc) => {
    const {  SellerName, AddressArray, Description, Name, Price, Thumbnail, Pictures, Category, Owner, BuyerID, Status, DeliveryProvider, DeliveryVehicle, SellerDeliveryPrice } = doc.data();
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
            SellerName,
            DeliveryProvider,
            DeliveryVehicle,
            SellerDeliveryPrice
    });
  });
  this.setState({
    products,
    isLoading: false,
  },
 );
}

componentDidMount(prevProps) {
  this.unsubscribe = this.collectionRef.onSnapshot(this.onDocumentUpdate);
}

componentWillUnmount() {
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
          <ProductCardComponent prevPage={'Listing'} completeProductObject = {item} />
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