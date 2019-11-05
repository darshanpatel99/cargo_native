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
import {
  Form,
  Container,
  Content,
  Input,
  CardItem,
  Text,
  Card,
  Item,
  Textarea,
  Button,
  
} from 'native-base';
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

var KEYBOARD_VERTICAL_OFFSET_HEIGHT = 0;
let storageRef;
//Success Image Url
const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';
let width = Dimensions.get('window').width;

let checkGoogleAddress= '';




export default class PostProductScreen extends Component {
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const title = navigation.getParam('title');
    const price = navigation.getParam('price');
    const productCategory = navigation.getParam('productCategory');
    const picArray = navigation.getParam('picArray');
    const imageSizes = navigation.getParam('imageSizes');
    const brandName = navigation.getParam('brandName');
    const condition = navigation.getParam('condition');

    console.log(brandName + " bN");

    storageRef = firebase.storage().ref();
    this.state={
      postAdClicked: false,
      showAlert: true,
      showAlert2: false,
      title : title,
      description : "",
      price :price,
      thumbnail : " ",
      image: picArray,
      imageSizes:imageSizes,
      downloadURLs : [],
      User:null,
      Category: productCategory,
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
      brandName:0,
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

  hideAlert2(){
    const { navigate } = this.props.navigation;
    //this.categoryRemover.current.changeState();
    this.avabilityRemover.current.changeState();
    //this.googlePlacesAutocomplete._handleChangeText('')
    //this.addressRemover.current.changeAddressState();

    this.setState({
      showAlert2: false,
      title : "",
      description : "",
      price : "",
      thumbnail : " ",
      image: [],
      downloadURLs : [],
      addressArray:[],
      uploadCounter:0,
      firstTimeOnly:true,
    });
    navigate('Home');
  };

  // getPermissionAsync = async () => {
  //   if (Constants.platform.ios) {
  //     console.log('ask permission');
  //     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL && Permissions.CAMERA);
  //     if (status !== 'granted') {
  //       alert('Sorry, we need camera roll permissions to make this work!');
  //     }
  //   }
  // };

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


  //Uploading all the product related stuff
  uploadImageData =  async () =>{
      var arraySizes = this.state.imageSizes;
      var array = this.state.image; //getting the uri array
      var first = this.state.firstTimeOnly;
      console.log("Total number of uris we have"+ array.length)
      this.setState({ loading: true });
      array.forEach(async (element,index) => {
   
        if(first){

          first=false;
          this.setState({firstTimeOnly:false});
          await this.uploadThumbnailToFirebase(element, arraySizes[index])
          .then(()=>{   
            
            console.log('Thumbnail got uploaded');
          })
          .catch(error=>{
            console.log("Hey there is an error:  " +error);
          });
          
        }

        await this.uploadImageToFirebase(element, arraySizes[index])
        .then(() => {
          console.log('Success' + uuid.v1());         
        })
        .catch(error => {
          console.log('Success' + uuid.v1()); 
          console.log(error);
        });

        
      });



  }


  //start post the add button
  startPostTheProduct = async () =>{
    let titleLength = this.state.title;
    let priceLength = parseInt( this.state.price);
    let descriptionLength = this.state.description;
    let productCategory = this.state.Category;
    let picArray = this.state.image;
    let timeArray = this.state.Avability;
    let address = this.state.googleAddressEmpty;
    let completeStringAddress = this.state.completeStringAddress;
    if(titleLength.length > 0 && priceLength >= 10 && priceLength <= 1000 && descriptionLength.length > 0 && productCategory !=0 && picArray.length>2 && timeArray.length>0 && this.state.completeStringAddress != '')  {
    await this.uploadImageData();
    }
    else {
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
      else if(timeArray.length==0 && picArray.length!=0 && (priceLength >= 10 || priceLength <= 1000)){
        this.setState({
          availableAlert:true,
        })
      }
  
      console.log(completeStringAddress)
  
      if( completeStringAddress == '' && picArray.length!=0 && timeArray.length!=0 && (priceLength >= 10 || priceLength <= 1000)){
        this.setState({
          showAddressAlert:true,
        })
      }
  
      this.setState({
        postAdClicked: true,
      })
    }
  }


  //post the product
  postTheProduct = async() =>{

    let titleLength = this.state.title;
    let priceLength = parseInt( this.state.price);
    let descriptionLength = this.state.description;
    let productCategory = this.state.Category;
    let picArray = this.state.image;
    let timeArray = this.state.Avability;
    let address = this.state.googleAddressEmpty;
    let completeStringAddress = this.state.completeStringAddress;

    console.log('length of the price' + priceLength.length);

    if(titleLength.length > 0 && priceLength >= 10 && priceLength <= 1000 && descriptionLength.length > 0 && productCategory !=0 && picArray.length>2 && timeArray.length>0 && address != '')  {

    console.log("Uploading the images");
  

    console.log('Download urls --> '+this.state.downloadURLs)
    
    //Additional data 
    var additionalData = {
      BrandName:this.state.brandName,
      Dimensions:{
        Height:this.state.dimensionHeight,
        Length: this.state.dimensionLength,
        Width: this.state.dimensionWidth
      },
      Age : this.state.age,
      Condition : this.state.condition,
      Color: this.state.color,
    }
    
    
    //sample data object 
    var data = {
      Description : this.state.description,
      Name : this.state.title,
      Price : this.state.price,
      Pictures : this.state.downloadURLs,
      Thumbnail : this.state.thumbnail,
      Owner : this.state.owner,
      Flag : true,
      FavouriteUsers:[],
      TimeStamp: null,
      UserClicks:[],
      Category: this.state.Category,
      Avability: this.state.Avability,
      Status:'active',
      //AddressArray: this.state.addressArray,
      BuyerID:'',
      SellerName: this.state.sellerName,
      BuyerName:'',
      BuyerAddress:'',
      DeliveryFee:'',
      TotalFee:'',
      BoughtStatus:'false',
      OrderNumber: -1,
      DeliveryProvider:0, //0 means cargo is hande
      FIC: true,
      AdditionalData: additionalData
    }

    //Getting the current time stamp
    var currentDate = new Date();
    data.TimeStamp = currentDate.getTime();
    //if(this.checkFields == true)
    //Posting the product.
    console.log("Product Posted---->" + data);
    PostProduct(data).then(()=>{
      this.setState({ loading: false });
      this.showAlert2();
    });
    console.log("Product Posted---->" + data);

    //change the overlay visibility to visible
    //this.setState({isOverlayVisible:true});
   


  } else {
    console.log('hello' + typeof(priceLength));

    if(picArray.length==0){
      this.setState({
        picAlert:true,
      })      
    }

    if((priceLength < 10 || priceLength > 1000) && picArray.length!=0){
      this.setState({
        priceAlert:true,
      })      
    }
    else if(timeArray.length==0 && picArray.length!=0 && (priceLength >= 10 || priceLength <= 1000)){
      this.setState({
        availableAlert:true,
      })
    }

    console.log(completeStringAddress)

    if(completeStringAddress == '' && picArray.length!=0 && timeArray.length!=0 && (priceLength >= 10 || priceLength <= 1000)){
      this.setState({
        showAddressAlert:true,
      })
    }

    this.setState({
      postAdClicked: true,
    })
  }

  };  
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



 
  //Uploading an Image to the Firebase
  uploadImageToFirebase = async (uri, localSizeObject) => {

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

    if(changedW.value  <= 800){
      changedW.valid = false
    }
    
   }
   else{
     changedH.isBiggest = true;
     if(changedH.value  <= 800){
       changedH.valid = false
     }
      
   }

    if(changedH.isBiggest == true && changedH.valid == true){
      difValue = Math.round(changedH.value/800);
    }

    if(changedW.isBiggest == true && changedW.valid == true){
      difValue =Math.round(changedW.value/800) ;
    }

    var finalH = 1 ; 
    var finalW = 1 ;
    
    finalH = changedH.value/difValue;

    finalW = changedW.value/difValue;

    console.log(finalW + " those are with 800  " + finalH)


    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize:{width:finalW, height:finalH} }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    )


    const response = await fetch(manipResult.uri);
    const blob = await response.blob();
    console.log('INside upload Image to Firebase')
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
        console.log('File available at', downloadURL);
        that.state.downloadURLs.push(downloadURL);

        //some funcky stuff
        var uploadC = that.state.uploadCounter+1;
        that.setState({uploadCounter:uploadC});
        var array = that.state.image;
          if(uploadC==array.length+1){
            //call the post product function
            console.log("Number of products uploaded:" + uploadC);
            that.postTheProduct();
          }
      });
    });
    return 'Success';
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

  testFunction(text){
    console.log('test fucntion');
    checkGoogleAddress = 'lalalals'
    console.log(checkGoogleAddress)
    this.state.googleAddressEmpty = text;
    //this.setState({googleAddressEmpty: 'test'})
    
  }

  render() {

    let { image } = this.state;
    const { user } = this.state;
    const {showAlert} = this.state;
    const {showAlert2} = this.state;
    const {noPictures} = this.state.picAlert;
    
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
              {/* Depending on device(ios or android) we'll change padding to textarea inputs  */}
              <Form>
                {Platform.OS === 'ios' ? (
                  <Textarea
                    rowSpan={5}
                    bordered
                    placeholder='Description'
                    name="description" 
                    onChangeText={(text)=>this.setState({description:text})}
                    value={this.state.description}
                    style={[styles.iosDescriptionStyle, this.changeInputFieldFunction(this.state.description) ? styles.correctStyle : styles.errorStyle]}
                    maxLength={500}
                    //returnKeyType='return'
                    
                  />
                ) : (
                  <Textarea
                    rowSpan={5}
                    bordered
                    placeholder='Description'
                    name="description" 
                    onChangeText={(text)=>this.setState({description:text})}
                    value={this.state.description}
                    style={[styles.androidDescriptionStyle, this.changeInputFieldFunction(this.state.description) ? styles.correctStyle : styles.errorStyle]}
                    maxLength={500}
                    //3returnKeyType='return'
                    
                  />
                )}
              </Form>
              <View style={[styles.productCategoryStyle, this.forPictures(this.state.Avability) ? styles.correctStyle : styles.errorStyle]}>
                <DaysPickerForPostProductScreen parentCallback={this.avabilitycallbackFunction} ref={this.avabilityRemover} />
              </View>

              {/* <GooglePlacesAutocomplete
                ref={c => this.googlePlacesAutocomplete = c}
                placeholder='Pickup Address'
                minLength={2}
                autoFocus={false}
                returnKeyType={'default'}
                fetchDetails={true}
                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed='false'    // true/false/undefined
                renderDescription={row => row.description} // custom description render
                
                textInputProps={{
                  onChangeText: (text) => {this.testFunction(text)}
                 }}
                onPress={(data, details = null) => {
                console.log(Object.values(details.geometry.location))
                let lat = Object.values(details.geometry.location)[0];
                let long = Object.values(details.geometry.location)[1];
                this.setState({addressArray: [lat, long]})
                this.setState({googleAddressEmpty: 'Added stuff'})
                let completeStringAddress= JSON.stringify(details.formatted_address)
                this.setState({completeStringAddress})
                //this.props.parentCallback(this.state.lat, this.state.long);
                //console.log('LAT --> ' + Object.values(details.geometry.location)[0])
                }}

                currentLocation={false}
                
                GoogleReverseGeocodingQuery={{
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                }}

                GooglePlacesSearchQuery={{
                  // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                  rankby: 'distance',
                  input :'address',
                  circle: '5000@50.676609,-120.339020',
                }}

               

                getDefaultValue={() => {
                    return ''; // text input default value
                }}
                query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: 'AIzaSyAIif9aCJcEjB14X6caHBBzB_MPSS6EbJE',
                    language: 'en', // language of the results
                    types: 'geocode', // default: 'geocode'
                    location: '50.66648,-120.3192',
                    region: 'Canada',
                    radius: 20000,
                    strictbounds: true,

                    types: 'address', // default: 'geocode'
                }}

                styles={{
                    textInputContainer: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    borderBottomWidth:0
                    },
                    textInput: {
                    height: 38,
                    color: '#5d5d5d',
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor:'blue',
                    marginLeft: 0,
                    marginRight: 0,
                    },
                    predefinedPlacesDescription: {
                    color: '#1faadb'
                    },
                }}
                /> */}

          <TextInput
            placeholder= 'Pickup Address'
            underlineColorAndroid="transparent"
            autoCapitalize='none'
            autoCorrect={false}
            style={styles.TextInputStyle}
            onChangeText = {text => this.setState({completeStringAddress: text, googleAddressEmpty: text})}
          />     
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: Dimensions.get('screen').height*0.01,
              }}
            >
              <Button style={styles.postAdButton} onPress={this.startPostTheProduct}>
                <Text>Post Ad</Text>
              </Button>
            </View>
            </Content>
            
          </InputScrollView>
          </KeyboardAvoidingView>
            <AwesomeAlert
            show={showAlert2}
            showProgress={false}
            title="Thank you"
            message={'Your add has been successfully submitted\n'}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText=" OK "
            confirmButtonColor={Colors.primary}
            onCancelPressed={() => {
              this.hideAlert2();
            }}
            onConfirmPressed={() => {
              this.hideAlert2();
            }}
          />

            <AwesomeAlert
            show={this.state.picAlert}
            showProgress={false}
            title="Alert"
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
            title="Alert"
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
            title="Alert"
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
            title="Alert"
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
{/* 
        <TouchableOpacity onPress={() => {
          this.showAlert();
        }}>
          <View style={styles.button}>
            <Text style={styles.text}>Try me!</Text>
          </View>
        </TouchableOpacity> */}

          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Alert"
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
