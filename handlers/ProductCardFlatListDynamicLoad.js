import React, {Component} from "react";
import {FlatList, View, ScrollView, ActivityIndicator, Text, Platform, InteractionManager } from "react-native";
import firebase from '../Firebase.js';
import ProductCardComponent from '../components/product/ProductCardComponent';
import shallowCompare from 'react-addons-shallow-compare'; // ES6


// this is work around to tackle that timer warning.
// check this link for more info https://github.com/firebase/firebase-js-sdk/issues/97

const _setTimeout = global.setTimeout;
const _clearTimeout = global.clearTimeout;
const MAX_TIMER_DURATION_MS = 60 * 1000;
if (Platform.OS === 'android') {
// Work around issue `Setting a timer for long time`
// see: https://github.com/firebase/firebase-js-sdk/issues/97
    const timerFix = {};
    const runTask = (id, fn, ttl, args) => {
        const waitingTime = ttl - Date.now();
        if (waitingTime <= 1) {
            InteractionManager.runAfterInteractions(() => {
                if (!timerFix[id]) {
                    return;
                }
                delete timerFix[id];
                fn(...args);
            });
            return;
        }

        const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
        timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
    };

    global.setTimeout = (fn, time, ...args) => {
        if (MAX_TIMER_DURATION_MS < time) {
            const ttl = Date.now() + time;
            const id = '_lt_' + Object.keys(timerFix).length;
            runTask(id, fn, ttl, args);
            return id;
        }
        return _setTimeout(fn, time, ...args);
    };

    global.clearTimeout = id => {
        if (typeof id === 'string' && id.startWith('_lt_')) {
            _clearTimeout(timerFix[id]);
            delete timerFix[id];
            return;
        }
        _clearTimeout(id);
    };
}




//This component will be used to get the products from firebase and render to flatlist
//This component uses FlatList

export default class ProductCardFlatListDynamicLoad extends Component {

  //In the constructor you can initializing the firebase service like firestore, authentication etc.
  //And set the initial state
    constructor(props) {
        super(props);
        this.state = {
          isLoading: true,
          key :'',
          sort: this.props.filtersAndSorts,
          searchText: '',
          searchProducts: []
        };
        this.searchArray = [];
        this.ref = firebase.firestore();
        this.collectionRef = this.ref.collection('Products').where('Status', '==', 'active');
        this.unsubscribe = null;
      }

      // This function is used to listen to database updates and updates the flatlist upon any change
      //We'll be pushing data to the products array as key value pairs
      //later we collect the data and render into the component whereever we want
      onCollectionUpdate = (querySnapshot) => {
        console.log('on collection update')
        const products = [];
        querySnapshot.forEach((doc) => {
          const {  SellerName, AddressArray, Description, Name, Price, Thumbnail, Pictures, Category, Owner, BuyerID, Status } = doc.data();
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
            SellerName
          });
        });
        this.setState({
          products,
          isLoading: false,
          searchArray: products
        },
       );
      }

      componentWillUnmount() {
        clearTimeout(this._timer);
        //this.ref.off();
      }


      componentDidMount() {
        this.unsubscribe = this.collectionRef.onSnapshot(this.onCollectionUpdate);
      }

      static getDerivedStateFromProps(nextProps, prevState) {
        let filteredProducts = [];
        let searchProducts = prevState.products;

              console.log("is it looping??")
              //let filteredProducts =[]
              let text = nextProps.searchText.toLowerCase()
              //let searchProducts = prevState.searchArray;
              if(searchProducts != undefined) {
                //const matches = prevState.searchArray.filter(s => s.includes('thi'));
                //let indexOfSearchedElements = prevState.searchArray.findIndex(element => element.includes("Ca"))
                                  
                let itemData;
                
                  const newData = searchProducts.filter(item => {
                    if(item.Name != undefined){      
                      itemData = item.Name.toUpperCase();
                      //console.log('This is item data  --> ' + itemData);
                      const textData = text.toUpperCase();
                      //console.log('This is TextData ************* '+ textData)
                      //console.log(""+item)
                      if (itemData.indexOf(textData) > -1 && nextProps.filters.length > 0) {
                        console.log("item " + item.Name)
                        if(item.Category == nextProps.filters[0])
                          filteredProducts.push(item)
                      } else if(itemData.indexOf(textData) > -1) {
                        filteredProducts.push(item)                        
                      }
                      
                    }
                      
                  });
                  console.log(newData)
                  
          } // <- this is setState equivalent
          return ({ sort: nextProps.filtersAndSorts } && {searchText: nextProps.searchText} && {searchProducts: filteredProducts})
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
          data={this.state.searchProducts}
          renderItem={({item}) =>
          <View >
            <ProductCardComponent  sellerName={item.SellerName} Status={item.Status} BuyerID={item.BuyerID} thumbnail={item.Thumbnail} pickupAddress={item.AddressArray} owner={item.Owner} id ={item.key} title = {item.Name} description = {item.Description} price = {item.Price}  pictures = {item.Pictures}  />
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
