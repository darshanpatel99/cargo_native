import React, {Component} from "react";
import {FlatList, View, ScrollView, ActivityIndicator } from "react-native";
import firebase from '../Firebase.js';
import ProductCardComponent from '../components/product/ProductCardComponent';
import shallowCompare from 'react-addons-shallow-compare'; // ES6


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
          products: [],
          key :'',
          sort: this.props.filtersAndSorts
        };
        this.ref = firebase.firestore().collection('Products');
        this.unsubscribe = null;
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
          isLoading: false,
       });
      }

      // shouldComponentUpdate(nextProps, nextState) {
      //   //console.log('this is nextprops ' + JSON.stringify(nextProps) );
      //   //console.log('this is nextstate ' + JSON.stringify(nextState) );
      //   // console.log(Object.keys(this.state.sort)[0])
      //   if(this.props.filtersAndSorts != nextProps.filtersAndSorts) {
      //     console.log('sort value' + Object.values(this.state.sort)[0]);
      //     if(Object.values(this.state.sort)[0] != ''){
      //       this.ref = firebase.firestore().collection('Products').orderBy(Object.keys(this.state.sort)[0], Object.values(this.state.sort)[0]); 
      //       this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
      //     } else{
      //       this.ref = firebase.firestore().collection('Products').orderBy(Object.keys(this.state.sort)[0]); 
      //       this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
      //     }       
      //     //return true;
      //     return true;
      // } else {return false}
        
      // }

      componentDidMount() {
        //this.ref = firebase.firestore().collection('Products').orderBy(this.state.sort);        
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
      }

      static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.filtersAndSorts !== prevState.filtersAndSorts) {
          //this.ref = firebase.firestore().collection('Products').orderBy(this.nextProps.filtersAndSorts);          
          return ({ sort: nextProps.filtersAndSorts }) // <- this is setState equivalent
        }
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
