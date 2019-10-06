import { AppLoading, registerRootComponent } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, Image } from 'react-native';
import AppTabNavigator from './navigation/AppTabNavigator';
import * as Sentry from 'sentry-expo';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo';

// import { SentrySeverity, SentryLog } from 'react-native-sentry';
//Sentry.config('https://18325944fed842348b66ce82bf59467d@sentry.io/1727748').install();
Sentry.init({
  dsn: 'https://18325944fed842348b66ce82bf59467d@sentry.io/1727748',
  enableInExpoDevelopment: false,
  debug: true
});

const customViewProps = {
  style: {
    backgroundColor: '#d3d3d3' // light gray
  }
};

export default class App extends React.Component {
//export default function App(props) {
//const [isLoadingComplete, setLoadingComplete] = useState(false);


  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
      isLoadingComplete:false,
      showRealApp: false,
    }
  }

  handleFinishLoading() {
    // setLoadingComplete(true);
     this.setState({
       isLoadingComplete: true,
       
     });
     //setCustomText(CustomText);
     // setCustomView(customViewProps);
  }

  async loadResourcesAsync() {
    await Promise.all([
      Asset.loadAsync([
        // require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        // ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free to
        // remove this if you are not using it in your app
        // 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'origo':require('./assets/fonts/Origo.ttf'),
        'nunito-Black':require('./assets/fonts/nunito/Nunito-Black.ttf'),
        'nunito-Bold':require('./assets/fonts/nunito/Nunito-Bold.ttf'),
        'nunito-ExtraBold':require('./assets/fonts/nunito/Nunito-ExtraBold.ttf'),
        'nunito-ExtraLight':require('./assets/fonts/nunito/Nunito-ExtraLight.ttf'),
        'nunito-Light':require('./assets/fonts/nunito/Nunito-Light.ttf'),
        'nunito-Medium':require('./assets/fonts/nunito/Nunito-Medium.ttf'),
        'nunito-Regular':require('./assets/fonts/nunito/Nunito-Regular.ttf'),
        'nunito-SemiBold':require('./assets/fonts/nunito/Nunito-SemiBold.ttf'),
        'Roboto': require('./node_modules/native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('./node_modules/native-base/Fonts/Roboto_medium.ttf'),
        
      
      }),
    ]);
  }
  
    handleLoadingError(error) {
      // In this case, you might want to report the error to your error reporting
      // service, for example Sentry
      console.warn(error);
    }

    _onDone = () => {
      this.setState({ showRealApp: true });
    };
    _onSkip = () => {
      this.setState({ showRealApp: true });
    };


  render() {
  if (!(this.state.isLoadingComplete) && !(this.props.skipLoadingScreen)) {
    return (
      <AppLoading
          startAsync={this.loadResourcesAsync}
          onFinish={() => this.setState({ isLoadingComplete: true })}
          onError={console.warn}
        />
    );
  } else {
    if (this.state.showRealApp) {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar hidden={false} barStyle="default" />}
          <AppTabNavigator />

        </View>
      );
    }
    else {
      return (
          <AppIntroSlider
            slides={slides}
            renderItem={this._renderItem}
            onDone={this._onDone}
            showSkipButton={true}
            onSkip={this._onSkip}
          />
        );
    }
  }
  
}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },

});

const slides = [
  {
    key: 's1',
    title: 'Welcome to CarGo',
    text: 'CarGo is a next generation used goods marketplace.\nCreate an account and get started today.\nStart shopping now, stress free.',
    image: {
      uri:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/intro_flight_ticket_booking.png',
    },
    backgroundColor: '#febe29',
  },
  {
    key: 's2',
    title: 'Post, Buy and Sell',
    text: 'Simply post your used goods on our marketplace.\nBrowse and Buy items on our extensive online marketplace.\nWatch as your items leave your hands and arrive in another.',
    image: {
      uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/intro_best_deals.png',
    },
    backgroundColor: '#3395ff',
  },
  {
    key: 's3',
    title: 'Delivery on Demand',
    text: 'Our drivers show up at your door and deliver your sold items.\nPurchase an item and have it delivered directly to you.\nOur reliable drivers deliver items quickly and efficiently.',
    image: {
      uri:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/intro_bus_ticket_booking.png',
    },
    backgroundColor: '#f6437b',
  },
];

registerRootComponent(App);