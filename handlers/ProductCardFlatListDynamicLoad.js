import React, {Component} from "react";
import {FlatList, View, ScrollView, ActivityIndicator } from "react-native";
import firebase from '../Firebase.js';
import ProductCardComponent from '../components/product/ProductCardComponent';


//This component will be used to get the products from firebase and render to flatlist
//This component uses FlatList
export default class ProductCardFlatListDynamicLoad extends Component {

  //In the constructor you can initializing the firebase service like firestore, authentication etc.
  //And set the initial state
    constructor(props) {
        super();
        this.ref = firebase.firestore().collection('Products');
        this.unsubscribe = null;
        this.state = {
          isLoading: true,
          products: [],
          key :''
        };
      }


      // This function is used to listen to database updates and updates the flatlist upon any change
      //We'll be pushing data to the products array as key value pairs
      //later we collect the data and render into the component whereever we want
      onCollectionUpdate = (querySnapshot) => {
        const products = [];
        querySnapshot.forEach((doc) => {
          const { Description, Name, Price, Thumbnail } = doc.data();
            // console.log(typeof Pictures['0']);
          products.push({
            key: doc.id,
            doc,
            Name,
            Description,
            Price,
            Thumbnail

          });
        });
        this.setState({
          products,
          isLoading: false,
       });
      }

      componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
      }

      render() {
    
        if(this.state.isLoading){
          return(
            <View style={styles.activity}>
              <ActivityIndicator size="large" color="#0000ff"/>
            </View>
          )
        }
        return (
  
        <ScrollView style={styles.scrollContainer}>

        <FlatList
          data={this.state.products}
          renderItem={({item}) =>
          <View >
            <ProductCardComponent id ={item.key} title = {item.Name} description = {item.Description} price = {item.Price} image = {item.Thumbnail}/>
          </View>
        }
        />
        </ScrollView>

        );
      }
    

}

const styles = {
    container: {
        flex: 1,
        paddingTop: 22
       },
       item: {
         padding: 10,
         fontSize: 18,
         height: 44,
       },
    scrollContainer: {
     flex: 1,
     paddingBottom: 22
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
    }
  }
