import React, {Component} from "react";
import {FlatList, View, ScrollView, ActivityIndicator, Text } from "react-native";
import firebase from '../Firebase.js';
import ProductCardComponent from '../components/product/ProductCardComponent';

//this is work around to tackle that timer warning.
//check this link for more info https://github.com/firebase/firebase-js-sdk/issues/97
import {Platform, InteractionManager} from 'react-native';

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
          query:'',
        };
        this.arrayholder = [];
        this.ref = firebase.firestore().collection('Products');
        this.unsubscribe = null;
        this.SearchFilterFunction = this.SearchFilterFunction.bind(this);

      }

      // This function is used to listen to database updates and updates the flatlist upon any change
      //We'll be pushing data to the products array as key value pairs
      //later we collect the data and render into the component whereever we want
      onCollectionUpdate = (querySnapshot) => {
        const products = [];
        querySnapshot.forEach((doc) => {
          const { Description, Name, Price, Thumbnail, Pictures } = doc.data();
            // console.log(typeof Pictures['0']);
          products.push({
            key: doc.id,
            doc,
            Name,
            Description,
            Price,
            Thumbnail,
            Pictures
          });
        });
        this.setState({
          products,
          isLoading: false,},
          function() {
            this.arrayholder = products;
          }
       );
      }
       

      

      static getDerivedStateFromProps(nextProps, prevState) {
        const that = this;
       
        if (nextProps.filtersAndSorts !== prevState.filtersAndSorts) {        
          return ({ sort: nextProps.filtersAndSorts} &&  {query: nextProps.searchText} ) // <- this is setState equivalent
        }
      }



      componentDidMount() {
        //this.ref = firebase.firestore().collection('Products').orderBy(this.state.sort);        
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
        
      }

      // shouldComponentUpdate(nextProps){
      //   console.log("Hello it's should compo..." + nextProps.searchText);
      //   console.log("Prevprops" + nextProps.searchText);
      //   // if (nextProps.searchText !== this.props.searchText) {
      //   // this.SearchFilterFunction();
      //   // return true;
      //   // }
      // }

      SearchFilterFunction (){
        // console.log('inside searachfilter func')
        
        let query = (this.state.query);
        console.log("this is query " + this.state.query);
        console.log("this is array holder " + this.arrayholder);

       // passing the inserted text in textinput
         const newData = this.arrayholder.filter(function(item) {
           //applying filter for the inserted text in search bar
           const itemData = item.Name ? item.Name.toUpperCase() : ''.toUpperCase();
           const textData = query.toUpperCase();
           console.log("itemdata " + itemData);
           console.log("This is textData " + textData );
           return itemData.indexOf(textData) > -1;
         });
         this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          arrayholder: newData,
          query: this.state.query,
        });
         console.log("sorted array holder " + this.arrayholder.Name);
      }

      render() {
        // this.SearchFilterFunction()
        console.log( " Query from card " + JSON.stringify(this.state.query));
        //console.log("HELOOOOOO  " + (this.state.dataSource));
        // let  sortedProducts =  this.state.products.filter(function(hero) {
        //   return this.state.products.Name == 'laptop';
        // });
    
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
          // data={this.arrayholder}
          renderItem={({item}) =>
          <View >
            <ProductCardComponent id ={item.key} title = {item.Name} description = {item.Description} price = {item.Price} image = {item.Thumbnail} pictures = {item.Pictures}  />
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
