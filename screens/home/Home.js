import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import ProductCardFlatListDynamicLoad from '../../handlers/ProductCardFlatListDynamicLoad';
import ProductListComponents from '../../components/product/ProductListComponents';
//import ProductFilterBar from '../../components/navigation/ProductFilterBar';
import Header from '../../components/headerComponents/Header';

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    // console.log("This is prop " + (props))
    this.state ={
      sort: {'Price': 'desc'}
    }
    //this.callbackFunction = this.callbackFunction.bind(this);
  }

  handleValues = (values) => {
    this.setState({sort: values});
}



 
  render() {
    return (
      <View style={styles.container}>
        <Header/>
        <View style={{ flex: 2 }}>
          <ProductListComponents handleValueChange={this.handleValues}/>
        </View>

        {/* <View style={{ flex: 0.8 }}>
          <ProductFilterBar />
        </View> */}

        <View style={{ flex: 6 }}>
          <ProductCardFlatListDynamicLoad filtersAndSorts = {this.state.sort}/>
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
