import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProductCardFlatListDynamicLoad from '../../handlers/ProductCardFlatListDynamicLoad';
import SearchFilterFunction from '../../handlers/ProductCardFlatListDynamicLoad';
import Header from '../../components/headerComponents/Header';
import { SearchBar } from 'react-native-elements';
import RefineCategoryHomeScreen from '../../components/category/RefineCategoryHomeScreen'
<<<<<<< HEAD
import { Platform } from '@unimodules/core';
import { Notifications } from 'expo';
import firebase from '../../Firebase';


=======
>>>>>>> master
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

    
    this.createNotificationAsync();

    //register the listener for messages channel
    this._notificationSubscription =  Notifications.addListener(this.handleNotification);


  }


  //Function to handle the notification
  handleNotification = (notification) => {
    this.setState({notification:notification});
  }

  //function to create the notification
  createNotificationAsync = () =>{
    Notifications.presentLocalNotificationAsync({
      title: 'CarGo',
      body:'Coming to Kamloops Soon',
      android:{
        channelId: 'messages',
        color: '#FF0000',
      },
    });
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
          placeholder="Type Here..."        
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