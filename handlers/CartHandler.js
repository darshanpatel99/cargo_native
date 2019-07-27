import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator, ScrollView, FlatList} from 'react-native';
import {Button} from 'native-base'
import firebase from '../Firebase.js';
import ProductCardComponent from '../components/product/ProductCardComponent'
import MainButton from '../components/theme/MainButton'


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

    componentDidMount() {
        (async () => {
            await this.loadCartItems();
        })();
    }

    async loadCartItems (){
        let cartProducts;
        console.log('pull items from firebase trigggg..')
        let cartItemsFromFirebase = firebase.firestore().collection('Users').doc('K3xLrQT1OrFirfNXfkYf');
        var getOptions = {
            //source: 'cache'
        };
        
        // Get a document, forcing the SDK to fetch from the offline cache.
        cartItemsFromFirebase.get(getOptions).then(function(doc) {
            // Document was found in the cache. If no cached document exists,
            // an error will be returned to the 'catch' block below.
            console.log("Cached document data:", doc.data().CartTest);
            cartProducts= doc.data().CartTest
        }).catch(function(error) {
            console.log("Error getting cached document:", error);
        });
        let products= []
        // this.newRef = firebase.firestore().getAll(...test);
        // console.log(newRef)

        await firebase.firestore().collection('Products').get()
              .then(querySnapshot => {
                querySnapshot.docs.forEach(doc => {
                    if(cartProducts.includes(doc.id)) {
                        const { Description, Name, Price, Thumbnail, Pictures } = doc.data();                        
                        products.push(doc.data());
                    }
              });
            });
            console.log(products)
            this.setState({
                products,
                isLoading: false,
             });
          }


    render(){
        // <TouchableOpacity
        //         onPress={this.onPress}>
        // <Text> Touch Here </Text>
        // </TouchableOpacity>    
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
              <MainButton title= 'Proceed to Checkout'/>
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
