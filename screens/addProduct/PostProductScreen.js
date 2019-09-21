// This screen will be used by customer to post the product

import React, { Component } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
  ScrollView
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
import { Header } from 'react-navigation';
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
      postAdClicked: false,
      showAlert: true,
      showAlert2: false,
      title : "",
      description : "",
      price : "",
      thumbnail : " ",
      image: [],
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
      sellerName:''
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



    this.getPermissionAsync();
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
        : headerAndStatusBarHeight;
  }

  componentWillUnmount() {
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
    this.categoryRemover.current.changeState();
    this.avabilityRemover.current.changeState();
    this.googlePlacesAutocomplete._handleChangeText('')
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

    });
    navigate('Home');
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      console.log('ask permission');
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL && Permissions.CAMERA);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
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

  //post the product
  postTheProduct = async() =>{

    let titleLength = this.state.title;
    let priceLength = parseInt( this.state.price);
    let descriptionLength = this.state.description;
    let productCategory = this.state.Category;
    let picArray = this.state.image;
    let timeArray = this.state.Avability;
    let address = this.state.googleAddressEmpty;

    console.log('length of the price' + priceLength.length);

    if(titleLength.length > 0 && priceLength >= 10 && priceLength <= 1000 && descriptionLength.length > 0 && productCategory !=0 && picArray.length>0 && timeArray.length>0 && address != '')  {
  
    console.log('Download urls --> '+this.state.downloadURLs)
    var data = {
      Description : this.state.description,
      Name : this.state.title,
      Price : this.state.price,
      Pictures : this.state.downloadURLs,
      Thumbnail : this.state.Thumbnail,
      Owner : this.state.owner,
      Flag : true,
      FavouriteUsers:[],
      TimeStamp: null,
      UserClicks:[],
      Category: this.state.Category,
      Avability: this.state.Avability,
      Status:'active',
      AddressArray: this.state.addressArray,
      BuyerID:'',
      SellerName: this.state.sellerName,
      BuyerName:'',
      BuyerAddress:'',
      DeliveryFee:'',
      TotalFee:'',
      BoughtStatus:'false',

    }

    //Getting the current time stamp
    var currentDate = new Date();
    data.TimeStamp = currentDate.getTime();
    //if(this.checkFields == true)
    //Posting the product
    PostProduct(data);
    console.log("Product Posted---->" + data);

    //change the overlay visibility to visible
    //this.setState({isOverlayVisible:true});
    this.showAlert2();

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

    console.log(address)

    if(address == '' && picArray.length!=0 && timeArray.length!=0 && (priceLength >= 10 || priceLength <= 1000)){
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
   * Function Description:
   */
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality:0.2,
     // allowsEditing: true,
      
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({
        image: this.state.image.concat([result.uri])
      });

      console.log(this.state.firstTimeOnly);
      if(this.state.firstTimeOnly){
        console.log('I am first time');
        await this.uploadThumbnailToFirebase(result.uri)
          .then(()=>{
            this.setState({firstTimeOnly:false});
            console.log('Thumbnail got uploaded');
          })
          .catch(error=>{
            console.log("Hey there is an error:  " +error);
          })
        }
    


     await this.uploadImageToFirebase(result.uri, uuid.v1())
        .then(() => {
          console.log('Success' + uuid.v1());  
        })
        .catch(error => {
          console.log('Success' + uuid.v1()); 
          console.log(error);
        });
    }
  };

    /**
   * Function Description:
   */
    
  _pickImageCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality:0.2
      //allowsEditing: true,
      
    });
    
    console.log(result);

    if (!result.cancelled) {
      this.setState({
        image: this.state.image.concat([result.uri])
      });


      console.log(this.state.firstTimeOny);

      if(this.state.firstTimeOnly){
       //Create Thumbnail only FirstTime
         console.log('I am first time');
        await this.uploadThumbnailToFirebase(result.uri)
          .then(()=>{
            this.setState({firstTimeOnly:false});
            console.log('Thumbnail got uploaded');
          })
          .catch(error=>{
            console.log(error);
          })
        }

     await this.uploadImageToFirebase(result.uri, uuid.v1())
        .then(() => {
          console.log('Success' + uuid.v1());  
        })
        .catch(error => {
          console.log('Success' + uuid.v1()); 
          console.log(error);
        });
    }
  };



  //Uploading the thumbnail to the Firebase Storage
  uploadThumbnailToFirebase = async (uri)=>{
    console.log('inside the upload thumbnial function');

    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize:{width:200, height:200} }],
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
          that.setState({Thumbnail:downloadURL}); // setting the Thumbnail URL
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
     this.googlePlacesAutocomplete._handleChangeText('')
     let num =1 
     num = num + this.changeAddressState;

     this.setState({
         changingAddress: num
     })
  };



 
  //Uploading an Image to the Firebase
  uploadImageToFirebase = async (uri, imageName) => {

    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [],
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
        
        <KeyboardAvoidingView

          style={{ flex: 1 }}
          behavior='padding'
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

              <GooglePlacesAutocomplete
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
                //this.props.parentCallback(this.state.lat, this.state.long);
                //console.log('LAT --> ' + Object.values(details.geometry.location)[0])
                }}

                currentLocation={false}
                
                GoogleReverseGeocodingQuery={{
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
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
                />

            
            
            </Content>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                //margin: 10
              }}
            >
              <Button style={styles.postAdButton} onPress={this.postTheProduct}>
                <Text>Post Ad</Text>
              </Button>
            </View>
          </InputScrollView>
          </KeyboardAvoidingView>
            <AwesomeAlert
            show={showAlert2}
            showProgress={false}
            title="Alert"
            message={'This is warning 1  \n This is warning 2 \n This is warning 3 '}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            //showCancelButton={true}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="Go to Home !!"
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
            message={'Upload images please!'}
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

  errorStyle:{
    borderColor:'red',
    borderWidth: 0.5 ,
    //borderColor: 'green'
  },
  correctStyle:{
    borderColor: Colors.primary,
    borderWidth:0.5,
  },


};