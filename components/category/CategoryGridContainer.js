import React from 'react';
import { View } from 'react-native';
import FeatherCategoryComponent from './FeatherCategoryComponent.js';
import IonIconsCategoryComponent from './IonIconsCategoryComponent';
import { ScrollView } from 'react-native-gesture-handler';


export default function CategoryGridContainer() {

  const categories = [
    {
      icon_name: 'monitor',
      name: 'Electronics'
    },
    {
      icon_name: '',
      name: ''
    }
  ]

  
  return (
    <ScrollView style={styles.scrollConatiner}>
        <View style={styles.container}>
          
          <View style={styles.rowconainer}>
            <FeatherCategoryComponent categoryIconName = "monitor" categoryName ="Electronics"  />
            <IonIconsCategoryComponent categoryIconName = "ios-american-football" categoryName ="Rugby"  />
            <IonIconsCategoryComponent categoryIconName = "ios-shirt" categoryName ="Electronics"  />
          </View>

          <View style={styles.rowconainer}>
            <FeatherCategoryComponent categoryIconName = "monitor" categoryName ="Electronics"  />
            <FeatherCategoryComponent categoryIconName = "monitor" categoryName ="Electronics"  />
            <FeatherCategoryComponent categoryIconName = "monitor" categoryName ="Electronics"  />
          </View>

          <View style={styles.rowconainer}>
            <FeatherCategoryComponent categoryIconName = "monitor" categoryName ="Electronics"  />
            <FeatherCategoryComponent categoryIconName = "monitor" categoryName ="Electronics"  />
            <FeatherCategoryComponent categoryIconName = "monitor" categoryName ="Electronics"  />
          </View>

          <View style={styles.rowconainer}>
            <FeatherCategoryComponent categoryIconName = "monitor" categoryName ="Electronics"  />
            <FeatherCategoryComponent categoryIconName = "monitor" categoryName ="Electronics"  />
            <FeatherCategoryComponent categoryIconName = "monitor" categoryName ="Electronics"  />
          </View>

          <View style={styles.rowconainer}>
            <FeatherCategoryComponent categoryIconName = "monitor" categoryName ="Electronics"  />
            <FeatherCategoryComponent categoryIconName = "monitor" categoryName ="Electronics"  />
            <FeatherCategoryComponent categoryIconName = "monitor" categoryName ="Electronics"  />
          </View>

        </View>

        </ScrollView>
    
  );
}

const styles = {
  container: {
    
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  scrollConatiner:{
    marginBottom: 30,
  },

  rowconainer: {
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight:10,
    marginLeft:10,
    paddingLeft:5,
    paddingRight:5,
    paddingTop:5,
    paddingBottom:5,
    marginBottom: 20
  }
}

