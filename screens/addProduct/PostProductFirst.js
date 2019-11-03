import * as React from 'react';
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
import { View, TouchableOpacity,ScrollView,Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import firebase from '../../Firebase.js';
import Colors from '../../constants/Colors';
import InputScrollView from 'react-native-input-scroll-view';
import CategoryPickerForPostProduct from '../../components/category/CategoryPickerForPostProduct';


// width for the style
let width = Dimensions.get('window').width;


export default class PostProductFirst extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            completeStringAddress: '',
            showAlert: true,
            owner: "",
            image:[],

        }

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

    componentWillUnmount() {

    //clearing the arrays
    // Clean up: remove the listener
    this._unsubscribe();
    this.focusListener.remove();
    }

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


  render() {
    const {showAlert} = this.state;
    if(this.state.User != null){
        return (
      <View style={{ flex: 1, alignItems:'center'}}>
      
            <Content padder contentContainerStyle={{ justifyContent: 'center' }}>

              <Card>
                <View  style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>

                  <TouchableOpacity onPress={this._pickImage}>
                    <CardItem style={styles.imageUploadStyle}>
                      <Ionicons name='ios-images' size={50} />
                    </CardItem>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={this._pickImageCamera}>
                    <CardItem style={styles.imageUploadStyle}>
                      <Foundation name='camera' size={50} />
                    </CardItem>
                  </TouchableOpacity>
                </View>
                <CardItem>
                  <ScrollView style={styles.scrollStyle} horizontal={true}>
                    {this._renderImages()}
                  </ScrollView>
                </CardItem>
              </Card>

              <Item style={{ marginBottom: 10}} >
                <Input placeholder='Title' 
                  name="title" 
                  onChangeText={(text)=>this.setState({title:text})}
                  value={this.state.title}
                  maxLength={50}
                  returnKeyType='done'
                    />
              </Item>
              <Item style={{ marginBottom: 10}}>
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
              <View style={styles.productCategoryStyle}>
              <CategoryPickerForPostProduct parentCallback = {this.callbackFunction} ref={this.categoryRemover}/>
              
              </View>  
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: Dimensions.get('screen').height*0.01,
              }}
            >

              <Button style={styles.postAdButton} onPress={() => this.props.navigation.navigate('AddProduct')}>
                <Text>Next</Text>
              </Button>
            </View>
            </Content>
            
      </View>
    );
    }
    else{
      
        return (
         
          <View style={styles.container}>   

  
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
        
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    imageUploadStyle: {
        height: 100,
        width: width/2 - 15,
        backgroundColor: '#D3D3D3',
        justifyContent: 'center'
    },

    imageContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center'
    },

    productCategoryStyle:{
        //borderRadius:50,
        borderWidth:0.5,
        justifyContent:'center',
        marginTop: 5,
        //alignItems:'center'
    },
  };