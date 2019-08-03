import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import ProductCardFlatListDynamicLoad from '../../handlers/ProductCardFlatListDynamicLoad';
import ProductListComponents from '../../components/product/ProductListComponents';
//import ProductFilterBar from '../../components/navigation/ProductFilterBar';
import Header from '../../components/headerComponents/Header';
import { SearchBar } from 'react-native-elements';

export default class HomeScreen extends React.Component {


  constructor(props) {
    super(props);
    //console.log("This is prop " + (props))
    this.state ={
      sort: {'All': ''},
      query:'',
    }
    //this.callbackFunction = this.callbackFunction.bind(this);
  }

  handleValues = (values) => {
    this.setState({sort: values});
  }

  handleQueryChange = query =>{
    console.log("Text => " +  query)

    
    this.setState(state => ({ ...state, query: query || "" }));
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
           // onChangeText={text => this.handleSearch(text)}   
            //query={this.state.query}                        
        /> 
        {/* <View >
          <ProductListComponents handleValueChange={this.handleValues}/>
        </View> */}

        {/* <View style={{ flex: 0.8 }}>
          <ProductFilterBar />
        </View> */}

        <View style={{ flex: 6 }}>
          <ProductCardFlatListDynamicLoad filtersAndSorts = {this.state.sort}  searchText = {this.state.query}/>
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
