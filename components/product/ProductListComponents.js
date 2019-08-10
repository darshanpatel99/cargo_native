import React, {Component}from 'react';
import { useState} from 'react';
import {KeyboardAvoidingView} from 'react-native';
import RefineCategoryHomeScreen from '../category/RefineCategoryHomeScreen'


import {
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    Text,
    View,
  } from 'react-native'
import SearchBar from '../theme/SearchBar';
//import ProductFilterBar from './ProductFilterBar';
//import ProductListComponents from '../product/ProductListComponents';

let sorts =  {all: true,  trending: false, new:false, high:false, Low:false};

export default class ProductListComponents extends Component {

    constructor(props){
      super(props);
      this.state={
          all: false,
          trending: true,
          new: false,
          high: false,
          Low: false,
          search: ''
      }
      this.handlerButtonOnClick = this.handlerButtonOnClick.bind(this);
      this.selectCategory = React.createRef();
  }

    handlerButtonOnClick =(txt) =>{
      for(const item in sorts) {
        
        if(sorts[item] == true) {
          sorts[item] = false;
          this.setState({[item]: false});
        }
      }
      this.setState({[txt]: true});
      sorts[txt] = true;
      // let sortValue = txt == 'Low' ? {Price:'yr'} ? 'High' :'et'
      let sortObject = {}
      if(txt == 'low'){
        sortObject= {'Price' : ''}
      }else if(txt == 'high'){
        sortObject= {'Price' : 'desc'}
      }else if(txt == 'trending'){
        sortObject= {'Trending' : 'desc'}
      }else {
        sortObject ={'timestamp' : 'asc'}
      }
      this.props.handleValueChange(sortObject);  

    }

    handleLangChange = () => {
          
  }


    render(){

      const { search } = this.state;      
    
    return (
      <KeyboardAvoidingView   behavior="height" enabled>
      <View style={styles.mycard}>
        

        {/* <View style={styles.sortbar}>
         
          <Text onPress = {this.handlerButtonOnClick.bind(this, 'all')}  style = {this.state.all ?  {fontSize: 15, fontWeight: 'bold',} : {fontSize: 15, fontWeight: 'normal',}} >All</Text>
          <Text onPress = {this.handlerButtonOnClick.bind(this, 'trending')} style = {this.state.trending ?  {fontSize: 15, fontWeight: 'bold',} : {fontSize: 15, fontWeight: 'normal',}} >Trending</Text>
          <Text onPress = {this.handlerButtonOnClick.bind(this, 'new')}  style = {this.state.new ?  {fontSize: 15, fontWeight: 'bold',} : {fontSize: 15, fontWeight: 'normal',}}  >New</Text>
          <Text onPress = {this.handlerButtonOnClick.bind(this, 'low')}  style = {this.state.Low ?  {fontSize: 15, fontWeight: 'bold',} : {fontSize: 15, fontWeight: 'normal',}}  >Low Price</Text>
          <Text onPress = {this.handlerButtonOnClick.bind(this, 'high')}  style = {this.state.high ?  {fontSize: 15, fontWeight: 'bold',} : {fontSize: 15, fontWeight: 'normal',}}  >High Low</Text>
        
        </View> */}

        <SearchBar searchReplacableText = "Search Categories"/> 
        <RefineCategoryHomeScreen />
        
        {/* <ProductFilterBar /> */}
      </View>

      </KeyboardAvoidingView>
    );
    }
  }


  const styles ={

    mycard: {
      
      borderRadius: 10,
      backgroundColor:'#f9f9f9',
      shadowColor: 'grey',
      shadowOpacity: 0.3,
      shadowRadius: 5,
      shadowOffset: {
        height: 1,
        width: 0
      },
      marginBottom: 0,
        
    },

    sortbar: {   
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft:15,
      paddingRight:10,
      marginTop: 10
    },
  };
