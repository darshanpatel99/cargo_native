import React from 'react';
import { View, StyleSheet, PushNotificationIOS, Linking } from 'react-native';
import ProductCardFlatListDynamicLoad from '../../handlers/ProductCardFlatListDynamicLoad';
import SearchFilterFunction from '../../handlers/ProductCardFlatListDynamicLoad';
import Header from '../../components/headerComponents/Header';
import { SearchBar } from 'react-native-elements';
import RefineCategoryHomeScreen from '../../components/category/RefineCategoryHomeScreen'
import { Platform } from '@unimodules/core';
import { Notifications } from 'expo';
import firebase from '../../Firebase';




export default class HomeScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state ={
      sort: {'All': ''},
      query:'',
      filters: [],
      notification: {},
    }
  }


  //Consider changing the value from here, Creating the Notification Channels
  componentDidMount=()=>{

    //creating the notification channels
    //Notification Channel for received messages
    if(Platform.OS == 'android'){
      Notifications.createChannelAndroidAsync('messages', {
        name:'Messages',
        priority: 'max',
        vibrate: [0, 250,250,250],
      });
    }

    
    //register the listeners for the depp links to your app
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.navigateToProduct(url);
      });
    } else {
        Linking.addEventListener('url', this.handleOpenURL);
      }

    //register the listener for messages channel
    this._notificationSubscription =  Notifications.addListener(this.handleNotification);


  }


  /**
   * Function Description: Handle the deep linking urls
   */
  handleDeepLinkingURL = (event)=>{
    console.log(event.url);
    const route = event.url.replace(/.*?:\/\//g, '');

    //Do something with the route
    this.navigateToPoduct(even.url);
  }


  /**
   * Function Description: navigate to the specific route
   */
  navigateToProduct = (uri)=>{
    console.log(uri);
    //get the product id from the deep linking uri
    var product_id = uri.split('?')[1].split('=')[1]
    firebase.firestore().collection('Products').doc(product_id).get().then((result)=>{
      var data = result.data();

      //props oject o be passed
      var props_to_detail = {
        BoughtStatus:data.BoughtStatus,  
        Status:data.Status, 
        itemId:product_id, 
        owner:data.Owner, 
        title:data.Name, 
        description:data.Description, 
        price:data.price, 
        pictures:data.Pictures, 
        pickupAddress:'', 
        sellerName: data.SellerName, 
        BuyerID:data.BuyerID, 
        thumbnail:data.Thumbnail, 
        Category : data.Category, 
        deliveryVehicle: data.DeliveryVehicle, 
        deliveryProvider: data.DeliveryProvider, 
        sellerDeliveryPrice: data.SellerDeliveryPrice}

        //Navigate to the Product Detail Screen
      this.props.navigation.push('Details', { completeProductObject: data, prevPage: 'Home'});

    }).catch((error)=>{
      console.log(error);
    });

  }


  // //Function to handle the notification
  handleNotification = (notification) => {
    this.setState({notification:notification});
    this.createNotificationAsync(notification);
  }

  // //function to create the notification
  createNotificationAsync = (notification) =>{
    let receiverId = notification.data.recieverId;
    let senderId = notification.data.senderId;
    let senderName= notification.data.senderName
    if(notification.origin=='selected'){
    this.props.navigation.push('ChatFromHomeScreen', {senderName: senderName, userID:senderId, owner: this.state.owner, previousScreen:'Home', reciverId: receiverId, senderId: senderId, completeChatThread: {chat: senderName, reciverId: receiverId, senderId: senderId  }})
    }
    if(Platform.OS == 'ios'){
      //PushNotificationIOS.presentLocalNotification({alertTitle: 'this is title', alertBody: 'this is body'});
      //Notifications.presentLocalNotificationAsync({title: notification.data.title, body: notification.data.body});

    }
    //Notifications.presentLocalNotificationAsync({title: notification.data.title, body: notification.data.body});
  }

 
  handleValues = (values) => {
    console.log('function called handleValues')
    this.setState({filters: values});
  }

  handleQueryChange = query =>{
    {SearchFilterFunction}
    this.setState(state => ({ ...state, query: query || "" }));
  }

  callbackFunction = (childData) => {
    this.setState({filters: childData})
    console.log("from home ==> "+ childData)
  }
 
  render() {
    return (
      <View style={styles.container}>
        <Header/>
        <SearchBar        
          placeholder="Search"        
          lightTheme        
          round  
          onChangeText={this.handleQueryChange}  
          value={this.state.query}                       
        />
        <RefineCategoryHomeScreen parentCallback = {this.callbackFunction} />       
        <View style={{ flex: 6 }}>
          <ProductCardFlatListDynamicLoad filtersAndSorts = {this.state.sort}  searchText = {this.state.query} filters= {this.state.filters}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  }
});