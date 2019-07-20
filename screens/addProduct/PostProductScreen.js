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
  Button
} from 'native-base';
import { Foundation, Ionicons } from '@expo/vector-icons';
import { Header } from 'react-navigation';
import Colors from '../../constants/Colors';
import { ImagePicker } from 'expo';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import CategoryPickerForPostProduct from '../../components/category/CategoryPickerForPostProduct';
import firebase from '../../Firebase.js';
import MyHeader from '../../components/headerComponents/Header'

var KEYBOARD_VERTICAL_OFFSET_HEIGHT = 0;
let storageRef;

export default class PostProductScreen extends Component {
  constructor(props) {
    super(props);
    storageRef = firebase.storage().ref();
  }
  state = {
    image: []
  };

  componentWillMount() {
    // Here Im calculating the height of the header and statusbar to set vertical ofset for keyboardavoidingview
    const headerAndStatusBarHeight = Header.HEIGHT + Constants.statusBarHeight;
    console.log('Header and Status Bar --> ' + headerAndStatusBarHeight);
    KEYBOARD_VERTICAL_OFFSET_HEIGHT =
      Platform.OS === 'ios'
        ? headerAndStatusBarHeight - 600
        : headerAndStatusBarHeight;
  }

  componentDidMount() {
    this.getPermissionAsync();
    console.log('component did mount');
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      console.log('ask permission');
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3]
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({
        image: this.state.image.concat([result.uri])
      });
      this.uploadImageToFirebase(result.uri, 'test-image')
        .then(() => {
          console.log('Success');
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  uploadImageToFirebase = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child('/images/' + imageName);
    const downloadableUrl = await ref.getDownloadURL();
    console.log('URL----> ' + downloadableUrl);
    return ref.put(blob);
  };

  deleteImageOnRemove(index) {
    var array = [...this.state.image]; // make a separate copy of the array
    console.log('This is array --> ' + index);
    this.uploadImageToFirebase(array);
    array.splice(index, 1);
    this.setState({ image: array });
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

    return images;
  }

  render() {
    let { image } = this.state;

    return (

      <View style={{flex:1}}>
        <MyHeader/>
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior='padding'
        keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET_HEIGHT}
      >
        <Container style={styles.mainConatiner}>
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

            <Item rounded style={{ marginBottom: 10 }}>
              <Input placeholder='Title' />
            </Item>
            <Item rounded style={{ marginBottom: 10 }}>
              <Foundation name='dollar' size={32} style={{ padding: 10 }} />
              <Input keyboardType='numeric' placeholder='0.00' />
            </Item>
            <CategoryPickerForPostProduct />

            {/* Depending on device(ios or android) we'll change padding to textarea inputs  */}
            <Form>
              {Platform.OS === 'ios' ? (
                <Textarea
                  rowSpan={5}
                  bordered
                  placeholder='Description'
                  style={styles.iosDescriptionStyle}
                />
              ) : (
                <Textarea
                  rowSpan={5}
                  bordered
                  placeholder='Description'
                  style={styles.androidDescriptionStyle}
                />
              )}
            </Form>
          </Content>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 10
            }}
          >
            <Button style={styles.postAdButton}>
              <Text>Post Ad</Text>
            </Button>
          </View>
        </Container>
        </KeyboardAvoidingView>
        
        </View>
    );
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
  }
};
