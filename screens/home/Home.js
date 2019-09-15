import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import ProductCardFlatListDynamicLoad from '../../handlers/ProductCardFlatListDynamicLoad';
import SearchFilterFunction from '../../handlers/ProductCardFlatListDynamicLoad';
import ProductListComponents from '../../components/product/ProductListComponents';
import Header from '../../components/headerComponents/Header';
import { SearchBar } from 'react-native-elements';
import RefineCategoryHomeScreen from '../../components/category/RefineCategoryHomeScreen'

export default class HomeScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state ={
      sort: {'All': ''},
      query:'',
      filters: [],
    }
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