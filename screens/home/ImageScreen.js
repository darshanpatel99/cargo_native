import React, { Component } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Colors from "../../constants/Colors";
import { SliderBox } from 'react-native-image-slider-box';


export default class ImageScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
    };
  };

 

  render() {
    const { navigation } = this.props;
    const pictures = navigation.getParam('pictures');
      return (
       
        <View style={styles.container}>   
           <SliderBox
            images={pictures}
            sliderBoxHeight={Dimensions.get('window').height}
            circleLoop= 'true'
            dotColor='#FFEE58'
            inactiveDotColor='#90A4AE'
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 15,
              marginHorizontal: 10,
              padding: 0,
              margin: 0
            }}
            //parentWidth={Dimensions.get('window').width}
          />
        </View>
      );
    }

}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
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
})