import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator, ScrollView, FlatList} from 'react-native';
import {Button} from 'react-native';
import firebase from '../Firebase.js';
import ProductCardComponent from '../components/product/ProductCardComponent'
import MainButton from '../components/theme/MainButton'
import StripePayment from '../components/payments/stripe'

export default class CartHandler extends Component {

    constructor(props){
        super(props);
        let finalcartvalue = 0;
        this.state = {
            isLoading: true,
            products: [],
            CartAmount: 0,
            key :'',
            sort: this.props.filtersAndSorts
        };
        this.ref = firebase.firestore().collection('Users').doc('K3xLrQT1OrFirfNXfkYf');
        //this.productsCollectionRef = firebase.firestore().collection('Products');
        this.unsubscribe = null;
        //this.loadCartItems = this.loadCartItems.bind(this); 
        console.log('This before did mount!')
        console.log(this.state.CartAmount);       
    }

    componentDidMount(prevProps) {

        this.unsubscribe = this.ref.onSnapshot(this.onDocumentUpdate);

    }
    //strip function
    stripeIt=()=>{



    }



    onDocumentUpdate = (documentSnapshot) => {
        let cartProducts;
        let totalCartAmount = 0;

        let products= [];
        cartProducts= documentSnapshot.data().Cart;   
        // console.log(cartProducts)         
            firebase.firestore().collection('Products').get()
                  .then(querySnapshot => {
                    querySnapshot.docs.forEach(doc => {
                        if(cartProducts.includes(doc.id)) {
                            console.log('Name is --> ' + doc.data().Name)
                            const { Description, Name, Price, Thumbnail, Pictures } = doc.data();
                            let tempprice = doc.data().Price; 
                            totalCartAmount = parseInt(totalCartAmount) + parseInt(doc.data().Price),                       
                            console.log('Price is --> ' + doc.data().Price);
                            console.log(typeof tempprice);
                            console.log(typeof parseInt(tempprice));

                            products.push({
                                key: doc.id,
                                doc,
                                Name,
                                Description,
                                Price,
                                Thumbnail,
                                Pictures,
                                
                            }
                            );
                            console.log('Before the set state!')
                            console.log(totalCartAmount);
                        }
                  });
                  
                this.setState({
                    products,
                    CartAmount: totalCartAmount,
                    isLoading: false,
                  })
  

                 });

          }


    render(
  
    ){
      console.log('This is in render!')
        console.log(this.state.CartAmount);
        finalcartvalue = this.state.CartAmount;

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
              <MainButton title= 'Proceed to Checkout' />
              <Button onPress={this.stripeIt} title='Stripe IT'/>
            </View>
            <StripePayment/>
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
