import React, {Component} from 'react';
import { ScrollView, StyleSheet,View,Image,Text,Button,TouchableHighlight,Dimensions} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import MainButton from "../../components/theme/MainButton"; //components\theme\MainButton.js
import Colors from "../../constants/Colors.js";
import firebase from '../../Firebase.js';
import { Item } from "native-base";
export class ProductScreen extends Component {
  
 constructor(props) {
   super(props);
   const { navigation } = this.props;
    const itemId = navigation.getParam('itemId');
   this.ref = firebase.firestore().collection('Products').doc(""+itemId);
   this.state = {
     pictures:[],
     data: {},
   } 
   this.ref.onSnapshot(doc => {
     this.setState({
       pictures: doc.data().Pictures,
       data: doc.data(),
     });
   });

   
  }
  
 render() {
   //console.log(this.state.data);
   return (
    
     <View style={styles.container}>
     <View style={styles.pictures}>
       <View style={{ flexDirection: 'row' }}>
              <ScrollView
                scrollEventThrottle={10000}
                horizontal={true}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={this.changePage}
                disableIntervalMomentum={true}
 
              >
                  {
                this.state.pictures.map((item, key) => (
                  <View key={key} style={{ flexDirection: 'row' }}>
                    <View style={styles.breaks}/>
                    <Image style={styles.images} source={{ uri: item }} />
                    <View style={styles.breaks}/>
                  </View>
                    
                      ))
                    }
              </ScrollView>
              

            </View>
         </View>
         <View style={styles.infotext}>
         <Text style={styles.productName}>{this.state.data.Name}</Text>
         <View style={styles.LocViewAndPrice}>
         <View style={styles.productLocView}>
           <FontAwesome name='map-marker' size={20} color={Colors.primary}/><Text style ={styles.productLoc}>Sahali, Kamloops</Text>
         </View>
         <View style={styles.priceDr}>
         <Text style={styles.price}>2.5$</Text>
           <FontAwesome name='car' size={22} color={Colors.primary}/>
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
  breaks: {
    width:Dimensions.get('window').width * 0.05,
  },
  images: {
    height:Dimensions.get('window').height*0.48,
    width: Dimensions.get('window').width*0.9,
  },
  pictures:{
    flex:6,
    alignItems: 'center',
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
