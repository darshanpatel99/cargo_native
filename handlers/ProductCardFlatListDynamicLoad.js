import React, {Component} from "react";
import {FlatList, View, ScrollView, ActivityIndicator, Platform, InteractionManager } from "react-native";
import firebase from '../Firebase.js';
import ProductCardComponent from '../components/product/ProductCardComponent';



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
          searchProducts: [],
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
          searchArray: products
        },
       );
      }

      componentWillUnmount() {
        //clearTimeout(this._timer);
        this.unsubscribe();   
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
                        //if the user choose the parent categry load all the products that are in all the sub-categories
                        var parentCategoryList= [];
                        parentCategoryList.push(1);
                        parentCategoryList.push(10);
                        parentCategoryList.push(21);
                        parentCategoryList.push(26);
                        parentCategoryList.push(31);
                        parentCategoryList.push(34);
                        parentCategoryList.push(43);

                        if(parentCategoryList.includes(nextProps.filters[0])){
                          var start=  parentCategoryList.indexOf(nextProps.filters[0]);
                          var end = parentCategoryList[start+1];

                          for(var i=start+1; i< end; i++ ){
                            if(item.Category == i)
                            filteredProducts.push(item)
                          }

                        }else{
                          if(item.Category == nextProps.filters[0])
                            filteredProducts.push(item)
                        }
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
            {/* <ProductCardComponent prevPage={'Home'} sellerName={item.SellerName} Status={item.Status} BuyerID={item.BuyerID} thumbnail={item.Thumbnail} pickupAddress={item.AddressArray} owner={item.Owner} id ={item.key} title = {item.Name} description = {item.Description} price = {item.Price}  pictures = {item.Pictures}  category = {item.Category} deliveryVehicle = {item.DeliveryVehicle} deliveryProvider={item.DeliveryProvider} sellerDeliveryPrice= {item.SellerDeliveryPrice}/> */}
            <ProductCardComponent prevPage={'Home'} completeProductObject = {item}/>

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
