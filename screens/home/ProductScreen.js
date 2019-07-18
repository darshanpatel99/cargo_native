import React, { Component } from "react";
import { ScrollView, StyleSheet,View,Image,Text,Button,TouchableHighlight,Dimensions} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MainButton from "../components/MainButton";
import firebase from '../Firebase.js';
import { Item } from "native-base";

export default class TestScreen extends Component {

 constructor(props) {
   super(props);
   this.ref = firebase.firestore().collection('Products').doc(this.props.id);
   this.state = {
     pictures:[],
     data: {}
   } 
   this.ref.onSnapshot(doc => {
     this.setState({
       pictures: doc.data().Pictures,
       data: doc.data()
     });
   });
  }
  
 render() {
   return (
    
     <View style={styles.container}>
     <View style={styles.pictures}>
       <ScrollView
         horizontal={true}
         pagingEnabled={true}
         showsHorizontalScrollIndicator={false}
       >
           <Image source={{ uri: this.state.pictures[0] }} style={styles.pics}/>
       </ScrollView>

         </View>

         <View style={styles.infotext}>

         <Text style={styles.productName}>{this.state.data.Name}</Text>

         <View style={styles.LocViewAndPrice}>

         <View style={styles.productLocView}>
           <Ionicons name='ios-pin' size={18}/><Text style ={styles.productLoc}>Sahali, Kamloops</Text>
         </View>

         <View style={styles.priceDr}>
         <Text style={styles.price}>2.5$</Text>
           <Ionicons name='ios-car' size={18}/>
         </View>

         </View>
         <Text>{this.state.data.Description} </Text>
         </View>



         <View style={styles.BottomPart}>

           <MainButton
           title={'Add to cart for ' + this.state.data.Price +'$' }

           />


         </View>


      </View>
 );
}
}




const styles = StyleSheet.create({
  container: {
    flex:10,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  pics : {
    height: 350,
    width: Dimensions.get('window').width,
    borderRadius: 5,
  },
  pictures:{
    flex:6,
    alignItems:'center',
  },
  infotext:{
    flex:2.5,
    paddingLeft:8,
    paddingRight:5,
  },
  productName:{
    fontSize:18,
    fontWeight:'500',
  },
  productLocView:{
    flexDirection:'row',
    flex:0.9,
    alignItems:'flex-start',
  },
  productLoc:{
    fontSize:18,
    fontWeight:'500',
    paddingLeft:7,
  },
  price:{
    fontSize:18,
    fontWeight:'500',
    paddingRight:7,
  },
  priceDr:{
    flex:0.2,
    flexDirection:'row',
    alignItems:'flex-end'
  },
  LocViewAndPrice:{
    paddingTop:15,
    paddingBottom:15,
    flexDirection:'row',
  },
  BottomPart:{
    flex:1,
    alignItems:'center',
    paddingBottom:10,
    paddingTop:10,
  },
  purchaseButton:{
    alignItems:'center',
    justifyContent:'center',
    width:300,
    height:50,
    borderRadius:14,
    backgroundColor:'rgb(57, 124,255)',
  },
  buttonText:{
    color:'white',
    fontSize:15,
    fontWeight:'800',
  },
});
