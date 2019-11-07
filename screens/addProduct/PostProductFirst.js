// This screen will be used by customer to post the product
import React, { Component } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
  ScrollView,
  TextInput
} from 'react-native';
import { Form,  Container,  Content,  Input,  CardItem,  Text,  Card,  Item,  Textarea,  Button } from 'native-base';
import { Foundation, Ionicons } from '@expo/vector-icons';
import { Header } from 'react-navigation-stack';
import Colors from '../../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import CategoryPickerForPostProduct from '../../components/category/CategoryPickerForPostProduct';
import DaysPickerForPostProductScreen from '../../components/category/DaysPickerForPostProductScreen';
import firebase from '../../Firebase.js';
import PostProduct from '../../functions/PostProduct';
import AwesomeAlert from 'react-native-awesome-alerts';
import uuid from 'react-native-uuid';
import InputScrollView from 'react-native-input-scroll-view';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as ImageManipulator from 'expo-image-manipulator';
import Spinner from 'react-native-loading-spinner-overlay';
import AdditionalInfo from '../../components/product/AdditionalInfo';
import Conditions from '../../components/product/conditions';

var KEYBOARD_VERTICAL_OFFSET_HEIGHT = 0;
let storageRef;
//Success Image Url
const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';
let width = Dimensions.get('window').width;

let checkGoogleAddress= '';




export default class PostProductScreen extends Component {
  constructor(props) {
    super(props);
    storageRef = firebase.storage().ref();
    this.state={
      preChoice : 0,
      postAdClicked: false,
      showAlert: true,
      showAlert2: false,
      title : "",
      description : "",
      price : "",
      thumbnail : " ",
      image: [],
      imageSizes:[],
      downloadURLs : [],
      User:null,
      Category: 0,
      Avability:[],
      owner: "",
      addressArray:[],
      picAlert : false,
      availableAlert:false,
      showAddressAlert:false,
      firstTimeOnly: true,
      lat: 0,
      long: 0,
      googleAddressEmpty: '',
      changingAddress:0,
      priceAlert:false,
      buyerID:'',
      sellerName:'',
      uploadCounter:0,
      loading: false,
      completeStringAddress:'',
      deliveryProvider:0, //0 means cargo is handling everyhing
      fic:true, // true means the item can be fit in car otherwise not, fic= fit in car
      brandName:'',
      dimensionHeight:0,
      dimensionWidth:0,
      dimensionLength:0,
      age:0,
      condition:'',
      color:''
    }

    this.categoryRemover = React.createRef();
    this.avabilityRemover = React.createRef();
    this.addressRemover = React.createRef();
    this.conditionRemover = React.createRef();

    //checking the current user and setting uid
    let user = firebase.auth().currentUser;
    if (user != null) {
      this.state.owner = user.uid;
      this.state.sellerName = user.displayName;
      console.log(" State UID ==> from  " + this.state.Owner);
    }

  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => { 
        //checking the current user and setting uid
        let user = firebase.auth().currentUser;
        if (user != null) {
        this.state.owner = user.uid;
        console.log(" State UID ==> from  " + this.state.Owner);
        }
    });

    //this.getPermissionAsync();
    this._unsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
    console.log('component did mount');
  }

   componentWillMount() {

    // Here Im calculating the height of the header and statusbar to set vertical ofset for keyboardavoidingview
    const headerAndStatusBarHeight = Header.HEIGHT + Constants.statusBarHeight;
    console.log('Header and Status Bar --> ' + headerAndStatusBarHeight);
    KEYBOARD_VERTICAL_OFFSET_HEIGHT =
      Platform.OS === 'ios'
        ? headerAndStatusBarHeight - 700
        : headerAndStatusBarHeight
  }

  componentWillUnmount() {

    //clearing the arrays
    this.setState({image:[], downloadURLs:[], addressArray:[],Avability:[], thumbnail:' ' });
    // Clean up: remove the listener
    this._unsubscribe();
    this.focusListener.remove();
  }
 
  showAlert(){
    this.setState({
      showAlert: true,
      
    });
  };

  hideAlert(){
    const { navigate } = this.props.navigation;
    this.setState({
      showAlert: true
    });
    navigate('Account');
  };

  showAlert2 () {
    this.setState({
      showAlert2: true
    });
  };

  //listens to the change in auth state
  onAuthStateChanged = user => {
    // if the user logs in or out, this will be called and the state will update.
    // This value can also be accessed via: firebase.auth().currentUser
    if (user != null){
      if(user.emailVerified){ // note difference on this line
        this.setState({ User: user});
      }
    }
    else{
      this.setState({ User: null});
    }

  };

  //start post the add button
  startPostTheProduct = async () =>{
    let titleLength = this.state.title;
    let priceLength = parseInt( this.state.price);
    let productCategory = this.state.Category;
    let picArray = this.state.image;
    if(titleLength.length > 0 && priceLength >= 10 && priceLength <= 1000 && productCategory !=0 && picArray.length>0)  {

        this.props.navigation.navigate('AddProduct', {
            title: this.state.title,
            price:  this.state.price,
            productCategory: this.state.Category,
            picArray: this.state.image,
            imageSizes: this.state.imageSizes,
            condition: this.state.condition,
            brandName:this.state.brandName,
          });
    }
    else {
        
        this.setState({
        postAdClicked: true,
      })
      console.log('hello');
      if(picArray.length < 3){

        this.setState({
          picAlert:true,
        })

      }
      else if((priceLength < 10 || priceLength > 1000) && picArray.length > 2){
        this.setState({
          priceAlert:true,
        })      
      }
    }
  }

  /**
   * Function Description: PIck the image
   */
  _pickImage = async () => {

    if (Constants.platform.ios) {
      console.log('ask permission');
      //const { status } = await Permissions.askAsync(Permissions.CAMERA);
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality:0.2,
     // allowsEditing: true,
      
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({
        image: this.state.image.concat([result.uri]),
        imageSizes : this.state.imageSizes.concat([this.sizeOfImageObj(result)])
      });
    }
  };

    /**
   * Function Description:
   */
    
  _pickImageCamera = async () => {

    if (Constants.platform.ios) {
      console.log('ask permission');
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      const { cameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality:0.2      
    });
    console.log("res is below");
    

    console.log("W2 " + result.width + "  H2" + result.height);
    console.log(result);
    
    if (!result.cancelled) {
      this.setState({
        image: this.state.image.concat([result.uri]),
        imageSizes : this.state.imageSizes.concat([this.sizeOfImageObj(result)])
      });
    }
  };

  sizeOfImageObj = (result) =>{

    var imageWidth = result.width;
    var imageHeigth = result.height;
    var biggerSide =0;
    var smallerSide = 0 ;

    if(imageHeigth>imageWidth){
      biggerSide = imageHeigth;
      smallerSide = imageWidth;
    }
    if(imageHeigth<imageWidth){
      biggerSide = imageWidth;
      smallerSide = imageHeigth;
    }
    if(imageHeigth == imageWidth)
    {
      biggerSide = imageHeigth;
      smallerSide = imageWidth;
    }

    var localSizeObject = {
      'height' : imageHeigth,
      'width' : imageWidth,
    }

    return localSizeObject;
  }

  //Uploading the thumbnail to the Firebase Storage
  uploadThumbnailToFirebase = async (uri, localSizeObject)=>{
    console.log('inside the upload thumbnial function');

    console.log("width " + localSizeObject.width + " height " + localSizeObject.height)

    var changedH = {
      'isBiggest' : false,
      'value' : localSizeObject.height,
      'valid' : true,
    }
   var changedW = {
    'isBiggest' : false,
    'value' : localSizeObject.width,
    'valid' : true,
  }

  var difValue = 1 ;
   
   if(changedH.value < changedW.value){
     changedW.isBiggest = true;

    if(changedW.value  <= 400){
      changedW.valid = false
    }
    
   }
   else{
     changedH.isBiggest = true;
     if(changedH.value  <= 400){
       changedH.valid = false
     }
      
   }

    if(changedH.isBiggest == true && changedH.valid == true){
      difValue = Math.round(changedH.value/400);
    }

    if(changedW.isBiggest == true && changedW.valid == true){
      difValue =Math.round(changedW.value/400) ;
    }

    var finalH = 1 ; 
    var finalW = 1 ;
    
    finalH = changedH.value/difValue;

    finalW = changedW.value/difValue;

    console.log(finalW + "  " + finalH)

    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize:{width:finalW, height:finalH} }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
    )

      console.log("Hey I  am the ManipResult:  "+ manipResult.uri);

      
      const response = await fetch(manipResult.uri);
      const blob =  await response.blob();
      console.log('Inside Thumnail upload Image to Firebase')
      var uploadTask = storageRef.child('images/'+uuid.v1()).put(blob);
      const that = this;
      
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('Thumbnail File available at', downloadURL);
          that.setState({thumbnail:downloadURL}); // setting the Thumbnail URL
          var uploadC = that.state.uploadCounter+1;
          that.setState({uploadCounter:uploadC});

        });
      });
    }
  


  
    checkIfInputNotEmpty(text) {
      // console.log(text)
      // if(this.props.postAdClicked  == true && text.length == 0) {
      //     alert('Please input address')
      // }
      this.props.checkInputEmpty(text)
  }

  changeAddressState = () => {
     // this.GooglePlacesRef.setAddressText("");
     //this.googlePlacesAutocomplete._handleChangeText('')
     let num =1 
     num = num + this.changeAddressState;

     this.setState({
         changingAddress: num
     })
  };
 

  //Delete Image on Remove
  deleteImageOnRemove(index) {
    var array = [...this.state.image]; // make a separate copy of the array
    console.log('This is array --> ' + index);
    //this.uploadImageToFirebase(array);
    array.splice(index, 1);

    var fireArray = [...this.state.downloadURLs];
    fireArray.splice(index,1);
    //console.log(array);
    this.setState({ image: array, downloadURLs:fireArray });
  }

  // goToHome=()=>{
  //   this.setState({isOverlayVisible:!this.state.isOverlayVisible});
  //   this.props.navigation.navigate('Home');
  // }


  _renderImages() {
    let images = [];

    //let remainder = 4 - (this.state.devices % 4);
    this.state.image.map((item, index) => {
      images.push(
        <TouchableOpacity
          key={index}
          onPress={() => {
            this.deleteImageOnRemove(index);
          }}
        >
          <View style={styles.imageContainer}>
            <Image
              key={index}
              source={{ uri: item }}
              style={{ width: 100, height: 100 }}
            />
            <Ionicons
              name='md-remove-circle'
              color='red'
              size={32}
              style={styles.deleteIcon}
            />
          </View>
        </TouchableOpacity>
      );
    });

    //reverse the array
    images.reverse();

    return images;
  }

  googleAddressCallback = (latitude, longitude) => {
    console.log('Latitude ' + latitude);
    console.log('Longitude ' + longitude);
    let addressArray = [latitude, longitude];
    this.setState({
      addressArray
    })


    //var latLongArray = dataFromChild.split(",");
  }

  googleAddressEmpty = (checkString) => {
    if (checkString.length == 0) {
      this.setState({
        googleAddressEmpty:'EMPTY'
      })
    } else {
      this.setState({
      googleAddressEmpty:checkString
      })
    }
  }


  //this functions gets the category id from the child component
  callbackFunction = (childData) => {
    this.setState({Category: childData[0]})
    console.log("from post product screen ==> "+ typeof childData[0])
  }

  avabilitycallbackFunction = (childData) => {
    this.setState({Avability: childData})
    console.log("product screen ==> "+ JSON.stringify(childData));
  }

  changeInputFieldFunction(text){
    

    if(this.state.postAdClicked) {
      if(text.length > 0){
        return true
      } else{
        return false
      }
    }

    return true
  }

  forCategoryColor(text){
    
    
    if(this.state.postAdClicked) {
      console.log("it is here")
      console.log(this.state.Category)
      if(text > 0){
        return true
      } else{
        return false
      }
    }

    return true
  }

  forPrice(text){
    
    
    if(this.state.postAdClicked) {
      if(text >= 10 && text <=1000){
        return true
      } else{
        return false
      }
    }

    return true
  }

  forPictures =(pictures)=>{
    if(this.state.postAdClicked) {
      if(pictures.length >0){
        return true
      } else{
        return false
      }
    }

    return true    
  }

  hidePicAlert =() =>{
    this.setState({
      picAlert:false,
    })    
  }

  availabilityAlertHide =() =>{
       this.setState({
         availableAlert:false,
       })
  }

  addressAlert =() =>{
    this.setState({
      showAddressAlert:false,
    })
  }

  closePriceAlert =() =>{
    this.setState({
      priceAlert:false,
    })
  }

  conditionCallBack = (callBack)=>{
    console.log( callBack[0]);
      this.setState({
        condition:callBack[0],
      })
  }

  render() {

    let { image } = this.state;
    const { user } = this.state;
    const {showAlert} = this.state;
    const {showAlert2} = this.state;
    const {noPictures} = this.state.picAlert;

    var addInfo = {
      fic : this.state.fic,
      deliveryProvider : this.state.deliveryProvider,
      age:this.state.age,
      brandName:this.state.brandName,
      dimensionsWidth : this.state.dimensionWidth,
      dimensionHeight:this.state.dimensionHeight,
      dimensionLength:this.state.dimensionLength,
      color : this.state.color,
      condition:this.state.condition,
    }
    
    if(this.state.User != null){
      return (
        <View style={{flex:1}}>

        <Spinner
          visible={this.state.loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />

        
        <KeyboardAvoidingView

          style={{ flex: 1 }}
          behavior='height'
          keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET_HEIGHT}
        >
          <InputScrollView>
            <Content padder contentContainerStyle={{ justifyContent: 'center' }}>

              <Card style={this.forPictures(this.state.image) ? styles.correctStyle : styles.errorStyle}>
                <View  style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>

                  <TouchableOpacity onPress={this._pickImage}>
                    <CardItem style={styles.imageUploadStyle}>
                      <Ionicons name='ios-images' size={32} />
                    </CardItem>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={this._pickImageCamera}>
                    <CardItem style={styles.imageUploadStyle}>
                      <Foundation name='camera' size={32} />
                    </CardItem>
                  </TouchableOpacity>
                </View>
                <CardItem>
                  <ScrollView style={styles.scrollStyle} horizontal={true}>
                    {this._renderImages()}
                  </ScrollView>
                </CardItem>
              </Card>

              <Item style={[{ marginBottom: 10},this.changeInputFieldFunction(this.state.title) ? styles.correctStyle : styles.errorStyle]}>
                <Input placeholder='Title' 
                  name="title" 
                  onChangeText={(text)=>this.setState({title:text})}
                  value={this.state.title}
                  maxLength={50}
                  returnKeyType='done'
                    />
              </Item>
              <Item style={[{ marginBottom: 10},this.forPrice(this.state.price) ? styles.correctStyle : styles.errorStyle]}>
                <Foundation name='dollar' size={32} style={{ padding: 10 }} />
                <Input keyboardType='numeric' 
                  placeholder='0.00'
                  name="price"
                  onChangeText={(text)=>this.setState({price:text})}
                  value={this.state.price} 
                  maxLength={4}
                  returnKeyType='done'
                  />
                  
              </Item>

              {/* Pick category for the product */}
              <View style={[styles.productCategoryStyle, this.forCategoryColor(this.state.Category) ? styles.correctStyle : styles.errorStyle]}>
              <CategoryPickerForPostProduct parentCallback = {this.callbackFunction} ref={this.categoryRemover}/>
              </View>
              
              {/* <AdditionalInfo 
              preChoice = {addInfo}/> */}

              <View
              style= {{
                borderColor:"blue",
                borderWidth:0.5,
                marginVertical: 10,
                padding : 4,
                backgroundColor:'white',
                
              }}>

              <Text style={
               {
                 marginLeft:5,
                 fontSize:20,
                 fontWeight:'500'
               } 
              }>
                Additional Information
              </Text>
              <Item
                 style={{
                 marginVertical:10,
                 backgroundColor:'white',
                 borderBottomColor:Colors.primary,
                 borderWidth:1,
               }}>
                <Input
               placeholder="Brand Name"
               name="Brand" 
               onChangeText={(text)=>this.setState({brandName:text})}
               value={this.state.brandName}
               maxLength={50}
               returnKeyType='done'
              />
              </Item>
              
              
                <Conditions ref ={this.condition} parentCallback={this.conditionCallBack} />
             

            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: Dimensions.get('screen').height*0.01,
              }}
            >
              <Button style={styles.postAdButton} onPress={this.startPostTheProduct}>
                <Text>Next</Text>
              </Button>
              
            </View>
            </Content>
            
          </InputScrollView>
          </KeyboardAvoidingView>


            <AwesomeAlert
            show={this.state.picAlert}
            showProgress={false}
            title="Oops!"
            message={'Please upload at least 3 images!'}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}            
            confirmText="OK"
            confirmButtonColor="#DD6B55"            
            onConfirmPressed={() => {
              this.hidePicAlert();
            }}
          />
          

          <AwesomeAlert
            show={this.state.availableAlert}
            showProgress={false}
            title="Oops!"
            message={'Choose availability'}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}            
            confirmText="OK"
            confirmButtonColor="#DD6B55"            
            onConfirmPressed={() => {
              this.availabilityAlertHide();
            }}
          />

            <AwesomeAlert
            show={this.state.showAddressAlert}
            showProgress={false}
            title="Oops!"
            message={'Choose pick up address'}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}            
            confirmText="OK"
            confirmButtonColor="#DD6B55"            
            onConfirmPressed={() => {
              this.addressAlert();
            }}
          />

            <AwesomeAlert
            show={this.state.priceAlert}
            showProgress={false}
            title="Oops!"
            message={'price should be from 10 to 1000 $'}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}            
            confirmText="OK"
            confirmButtonColor="#DD6B55"            
            onConfirmPressed={() => {
              this.closePriceAlert();
            }}
          />

          </View>
        
      );

    }
    else{
      
      return (
       
        <View style={styles.container}>   

          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Oops!"
            message="Please login first!"
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="Go to login!!"
            confirmButtonColor={Colors.primary}
            onCancelPressed={() => {
              this.hideAlert();
            }}
            onConfirmPressed={() => {
              this.hideAlert();
            }}
          />


        </View>
      );
    }
  }
}

const styles = {
  mainConatiner: {
    flex: 1
  },
  imageUploadStyle: {
    height: 100,
    width: width/2 - 15,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center'
  },
  contentWrapperStyle: {},
  iosDescriptionStyle: {
    padding: 30,
    
  },
  androidDescriptionStyle: {
    padding: 20,
    borderRadius:1,
  },
  imageContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0
  },
  postAdButton: {
    backgroundColor: Colors.secondary
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: "#AEDEF4",
  },
  text: {
    color: '#fff',
    fontSize: 15
  },
  productCategoryStyle:{
    //borderRadius:50,
    borderWidth:0.5,
    justifyContent:'center',
    marginTop: 5,
    //alignItems:'center'
  },
  
  spinnerTextStyle: {
    color: '#0000FF'
  },


  errorStyle:{
    borderColor:'red',
    borderWidth: 0.5 ,
    //borderColor: 'green'
  },
  correctStyle:{
    borderColor: Colors.primary,
    borderWidth:0.5,
  },

  TextInputStyle: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    //textAlign: "center",
    alignItems: "center",
    height: 40,
    //width: 120,
    borderRadius: 5,
    //margin: 10,
    marginTop:10,
    padding:10,
    //backgroundColor: "#f8f8f8",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    borderWidth: 0.5,
    borderColor: Colors.primary,
  },
};