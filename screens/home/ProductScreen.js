import React, {Component} from 'react';
import { ScrollView, StyleSheet,View,Image,Text,Button,TouchableHighlight,Dimensions} from 'react-native';
import {StackActions } from 'react-navigation';
import {FontAwesome, Ionicons} from '@expo/vector-icons';
import FlipCard from 'react-native-flip-card'
import MainButton from "../../components/theme/MainButton"; //components\theme\MainButton.js
import Colors from "../../constants/Colors.js";
import firebase from '../../Firebase.js';
import { TouchableOpacity } from 'react-native-gesture-handler';

export class ProductScreen extends Component {
 constructor(props) {
  super(props);
  const { navigation } = this.props;
  const title = navigation.getParam('title');
  const description = navigation.getParam('description');
  const price = navigation.getParam('price');
  const pictures = navigation.getParam('pictures');
  const id = navigation.getParam('itemId');


  this.ref = firebase.firestore().collection('Users').doc("K3xLrQT1OrFirfNXfkYf");


  this.state = {
    pictures:[],
    cart: [],
    address: {},
    title,
    count: 0,
    description,
    pictures,
    price,
    id,
    itemAlreadyInCart: false,
    buttonTitle:'Add to Cart'
  }


   this.DecreaseInCountValue = this.DecreaseInCountValue.bind(this);
   this.IncreaseInCountValue = this.IncreaseInCountValue.bind(this);
   this.NavigateToCart = this.NavigateToCart.bind(this);
   this.CheckIfProductAlreadyInCart = this.CheckIfProductAlreadyInCart.bind(this)



  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   //return this.state.cart != nextState.cart;
  //   return true;
  // }

  componentDidMount(){
    this.props.navigation.setParams({ handleCartItems: this.NavigateToCart })   
    this.props.navigation.setParams({ handleGoBack: this.GoBack })
    let cart=[]
    let address= {}
    let that = this // here your variable declaration    
    // this.ref.onSnapshot(doc => {
    //   // this.setState({
    //     address= doc.data().Address,
    //     cart= doc.data().Cart,
    //     // });
    //     console.log('this is data -- > >>>' + doc.data().Cart)
    //   })    

    this.ref.get().then(function(doc) {
      console.log('this document data -- > ' + doc.data())
      cart = doc.data().Cart;
      address = doc.data().Address;
      let cartLength = cart.length;
      that.setState({
        cart:cart,
        address:address,
        count: cartLength,
     });
    //  console.log('comp did update -- ' + that.state.address);
    //  console.log('cart did update ' + that.state.cart.length);
     if(cart.includes(that.state.id)){
      //alert('Item exists in cart');
      that.setState({
        itemAlreadyInCart: true,
      })
      if(that.state.itemAlreadyInCart){
        that.setState({buttonTitle: 'Remove from Cart'})
      }
     }
     console.log('this is product id --> ' + that.state.id)
    })

    let cartLength = cart.length;


   //console.log('this is cart items -->  ' + this.state.cart)
   
  }



  DecreaseInCountValue() {
    this.setState({ count: this.state.count - 1})
    this.setState({ itemAlreadyInCart: false, buttonTitle: 'Add to Cart'})    
    testValue= this.state.count;
    let productsInCart= this.state.cart;
    productsInCart.pop();
    this.ref.update({
      Cart: productsInCart,
      itemAlreadyInCart: true
    })
  }

  IncreaseInCountValue() {
    this.setState({ count: this.state.cart.length + 1})
    this.setState({ itemAlreadyInCart: true, buttonTitle: 'Remove from Cart' })
    testValue= this.state.count;
    let test = this.state.cart
    test.push(this.state.id)
      this.ref.update({
        Cart: test,
        itemAlreadyInCart: false
      })
  }

  NavigateToCart = ({ navigation }) =>{
    console.log('navigate to cart called')
    const { navigate } = this.props.navigation;
    this.props.navigation.dispatch(StackActions.popToTop());
    navigate('Cart',{PreviousScreen : 'ProductScreen'});   
  }


  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    
    return ({
    headerRight: (

       <TouchableHighlight onPress={ params.handleCartItems } style={{marginRight: 10}}>
          <FontAwesome
              name="shopping-cart"
              size={50}
              color={Colors.primary}
          />
        </TouchableHighlight>
    ),
    })
  };


  CheckIfProductAlreadyInCart(){

    if(this.state.itemAlreadyInCart) {
      return <View style={styles.removeFromCartButton}><Button color='#fff' title= {this.state.buttonTitle} onPress={this.DecreaseInCountValue} /></View>
    } else{
      return <View style={styles.addToCartButton}><Button color='#fff' title= {this.state.buttonTitle} onPress={this.IncreaseInCountValue} /></View>
      
    }
  }
  
 render() {

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
         <Text style={styles.productName}>{this.state.title}</Text>
         {/* <Text>Local number => {this.state.count} </Text>
         <Text>Total product in firebase => {this.state.cart.length}</Text> */}
         <View style={styles.LocViewAndPrice}>
         <View style={styles.productLocView}>
           <FontAwesome name='map-marker' size={20} color={Colors.primary}/><Text style ={styles.productLoc}>Sahali, Kamloops</Text>
         </View>
         <View style={styles.priceDr}>
         <Text style={styles.price}>2.5$</Text>

           <FontAwesome name='car' size={22} color={Colors.primary}/>
         </View>
         </View>
         <Text>{this.state.description}</Text>

         </View>
         <View style={styles.BottomPart}>
            {this.CheckIfProductAlreadyInCart()}
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
  addToCartButton:{
     backgroundColor: Colors.primary,
     borderRadius: 10,
     paddingLeft: 10,
     paddingRight: 10
  },
  removeFromCartButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10
  }
  
});
