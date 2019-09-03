// This screen will be used by customer to post the product

import React, { Component } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  ScrollView,
  View
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
  Thumbnail
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
import MyHeader from '../../components/headerComponents/Header';
import Login from '../../components/navigation/NavigateLogin';
import PostProduct from '../../functions/PostProduct';
import { Overlay } from 'react-native-elements';
import GooglePlaces from '../../components/maps/GooglePlaces'
import AwesomeAlert from 'react-native-awesome-alerts';
import uuid from 'react-native-uuid';
import InputScrollView from 'react-native-input-scroll-view';




var KEYBOARD_VERTICAL_OFFSET_HEIGHT = 0;
let storageRef;

//Success Image Url
const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';

export default class PostProductScreen extends Component {
  constructor(props) {
    super(props);
    storageRef = firebase.storage().ref();
    this.state={
      postAdClicked: false,

      showAlert: true,
      title : "",
      description : "",
      price : "",
      thumbnail : " ",
      image: [],
      downloadURLs : [],
      isOverlayVisible: false,
      User:null,
      Category: 0,
      Avability:[],
      owner: "",
      addressArray:[],
    }

    //checking the current user and setting uid
    let user = firebase.auth().currentUser;
    if (user != null) {
      this.state.owner = user.uid;
      console.log(" State UID ==> from  " + this.state.Owner);
    }
    this.showAlert = this.showAlert.bind(this);
  }

  componentDidMount() {
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
        ? headerAndStatusBarHeight - 600
        : headerAndStatusBarHeight;

  }

  componentWillUnmount() {
    // Clean up: remove the listener
    this._unsubscribe();
  }
 
  showAlert(){
    this.setState({
      showAlert: true
    });
  };

  hideAlert(){
    const { navigate } = this.props.navigation;
    this.setState({
      showAlert: true
    });
    navigate('Account');
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      console.log('ask permission');
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  //listens to the change in auth state
  onAuthStateChanged = user => {
    // if the user logs in or out, this will be called and the state will update.
    // This value can also be accessed via: firebase.auth().currentUser
    this.setState({ User: user });
    //navigate to the account screen if the user is not logged in

  };


  //post the product
  postTheProduct = async() =>{

    let titleLength = this.state.title;
    let priceLength = this.state.price;
    let descriptionLength = this.state.description;

    if(titleLength.length > 0 && priceLength.length > 0 && descriptionLength.length > 0)  {
  
    console.log('Download urls --> '+this.state.downloadURLs)
    var data = {
      Description : this.state.description,
      Name : this.state.title,
      Price : this.state.price,
      Pictures : this.state.downloadURLs,
      Thumbnail : this.state.downloadURLs[0],
      Owner : this.state.owner,
      Flag : true,
      FavouriteUsers:[],
      TimeStamp: null,
      UserClicks:[],
      Category: this.state.Category,
      Avability: this.state.Avability,
      Status:'active',
      AddressArray: this.state.addressArray,
    }

    //Getting the current time stamp
    var currentDate = new Date();
    data.TimeStamp = currentDate.getTime();
    //if(this.checkFields == true)
    //Posting the product
    PostProduct(data);
    console.log("Product Posted---->" + data);

    //change the overlay visibility to visible
    this.setState({isOverlayVisible:true});
  } else {
    console.log('hello');
    
    this.setState({
      postAdClicked: true
    })
  }

  }


  /**
   * Function Description:
   */
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({
        image: this.state.image.concat([result.uri])
      });
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

  uploadImageToFirebase = async (uri, imageName) => {
    const response = await fetch(uri);
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

  goToHome=()=>{
    this.setState({isOverlayVisible:!this.state.isOverlayVisible});
    this.props.navigation.navigate('Home');
  }


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

  render() {

    let { image } = this.state;
    const { user } = this.state;
    const {showAlert} = this.state;

    
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
              <Card>
                <TouchableOpacity onPress={this._pickImage}>
                  <CardItem style={styles.imageUploadStyle}>
                    <Foundation name='camera' size={32} />
                  </CardItem>
                </TouchableOpacity>

                <CardItem>
                  <ScrollView style={styles.scrollStyle} horizontal={true}>
                    {this._renderImages()}
                  </ScrollView>
                </CardItem>
              </Card>

              <Item rounded style={{ marginBottom: 10, borderColor: this.changeInputFieldFunction(this.state.title) ? Colors.secondary : 'red' } }>
                <Input placeholder='Title' 
                  name="title" 
                  onChangeText={(text)=>this.setState({title:text})}
                  value={this.state.title}/>
              </Item>
              <Item rounded style={{ marginBottom: 10, borderColor: this.changeInputFieldFunction(this.state.price) ? Colors.secondary : 'red' }}>
                <Foundation name='dollar' size={32} style={{ padding: 10 }} />
                <Input keyboardType='numeric' 
                  placeholder='0.00'
                  name="price"
                  onChangeText={(text)=>this.setState({price:text})}
                  value={this.state.price} />
              </Item>

              {/* Pick category for the product */}
              <CategoryPickerForPostProduct parentCallback = {this.callbackFunction}/>
              
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
                    style={[styles.iosDescriptionStyle,{borderColor: this.changeInputFieldFunction(this.state.description) ? Colors.secondary : 'red'}]}
                  />
                ) : (
                  <Textarea
                    rowSpan={5}
                    bordered
                    placeholder='Description'
                    name="description" 
                    onChangeText={(text)=>this.setState({description:text})}
                    value={this.state.description}
                    style={[styles.androidDescriptionStyle,{borderColor: this.changeInputFieldFunction(this.state.description) ? Colors.secondary : 'red'}]}
                  />
                )}
              </Form>

              <DaysPickerForPostProductScreen parentCallback={this.avabilitycallbackFunction}/>
              <GooglePlaces parentCallback = {this.googleAddressCallback}/>
            </Content>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 10
              }}
            >
              <Button style={styles.postAdButton} onPress={this.postTheProduct}>
                <Text>Post Ad</Text>
              </Button>
            </View>
          </InputScrollView>
          </KeyboardAvoidingView>

          <Overlay
            isVisible={this.state.isOverlayVisible}
            windowBackgroundColor="rgba(255, 255, 255, .5)"
            overlayBackgroundColor=" #f5f2d0"
            
            width="auto"
            height="auto"
            >
            <Image source={{uri:successImageUri}} style={{ width: 100, height: 100, marginBottom: 25 }}/>
            <Button onPress={this.goToHome}>
              <Text>Go to Home</Text>
            </Button>
          </Overlay>
          
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
            confirmButtonColor="#DD6B55"
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
    backgroundColor: '#D3D3D3',
    justifyContent: 'center'
  },
  contentWrapperStyle: {},
  iosDescriptionStyle: {
    padding: 30
  },
  androidDescriptionStyle: {
    padding: 20
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
};