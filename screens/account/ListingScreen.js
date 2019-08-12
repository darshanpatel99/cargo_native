import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator, ScrollView, FlatList} from 'react-native';
import {Button} from 'native-base'
import firebase from '../../Firebase.js'; //Firebase.js C:\User1\CarGoDev\Relevent1 CarGo\cargo-native-v1\Firebase.js
import ProductCardComponent from '../../components/product/ProductCardComponent'
import MainButton from '../../components/theme/MainButton'
import { withNavigation } from 'react-navigation';

export default class ListingScreen extends Component{
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
    this.ref = firebase.firestore().collection('Users').doc(id+'');
    //this.productsCollectionRef = firebase.firestore().collection('Products');
    this.unsubscribe = null;
    //this.loadCartItems = this.loadCartItems.bind(this);        
}

componentDidMount(prevProps) {

    this.unsubscribe = this.ref.onSnapshot(this.onDocumentUpdate);

}



onDocumentUpdate = (documentSnapshot) => {
    let cartProducts;
    let products= [];
    cartProducts= documentSnapshot.data().ActiveProducts;            
        firebase.firestore().collection('Products').get()
              .then(querySnapshot => {
                querySnapshot.docs.forEach(doc => {
                    if(cartProducts.includes(doc.id)) {
                        console.log('Name is --> ' + doc.data().Name)
                        const { Description, Name, Price, Thumbnail, Pictures } = doc.data();                        
                        products.push({
                            key: doc.id,
                            doc,
                            Name,
                            Description,
                            Price,
                            Thumbnail,
                            Pictures
                        }
                        );
                    }
              });
              
            this.setState({
                products,
                isLoading: false,
              })


             });

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
          <ProductCardComponent id ={item.key} title = {item.Name} description = {item.Description} price = {item.Price} image = {item.Thumbnail} pictures = {item.Pictures}  />
        </View>
      }
      />

      </ScrollView>
      <View style={{flexDirection: 'row', justifyContent:'center'}}>
          <MainButton title= 'Edit List'/>
        </View>
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