import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import ProductCardFlatListDynamicLoad from '../../handlers/ProductCardFlatListDynamicLoad';
import ProductListComponents from '../../components/product/ProductListComponents';
import ProductFilterBar from '../../components/navigation/ProductFilterBar';
import Header from '../../components/headerComponents/Header';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);


}


  render() {
    return (
      <View style={styles.container}>
        <Header/>

        <View style={{ flex: 0.8 }}>
          <ProductFilterBar />
        </View>
        <View style={{ flex: 1 }}>
          <ProductListComponents />
        </View>

        <View style={{ flex: 7 }}>
          <ProductCardFlatListDynamicLoad />
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
