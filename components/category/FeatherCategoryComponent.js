import React from 'react';
import {
  Text,
  View,
  StyleSheet,
} from "react-native";
import {Feather } from '@expo/vector-icons';

export default function FeatherCategoryComponent(props) {
  return (
      <View>
        <View style={styles.mycard}> 
            <View style={styles.iconWrapper}> 
                <Feather style={styles.IconStyle}name={props.categoryIconName} size={50} color="#4383FF"/>
            </View>

        </View>
        <View style = {styles.textWrapper}>
            <Text style={styles.TextStyle}> {props.categoryName} </Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  

  mycard: {
    height:80,
    width:80,
    padding: 15,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor:'#f9f9f9',
    shadowColor: 'grey',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 0
    },
    marginBottom: 4
      
  },

  IconStyle : {
    textAlign: 'center'
  },

  TextStyle: {
    color: '#3498DB',
    padding: 2,
    textAlign: 'center'
  },
});
