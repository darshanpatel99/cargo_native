import { AppLoading, registerRootComponent } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import AppTabNavigator from './navigation/AppTabNavigator';


const customViewProps = {
  style: {
    backgroundColor: '#d3d3d3' // light gray
  }
};


export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);


  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
      
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar hidden={false} barStyle="default" />}
        <AppTabNavigator />

      </View>
    );
  }

}

async function loadResourcesAsync() {
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



function handleLoadingError(error: Error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
  //setCustomText(CustomText);
  // setCustomView(customViewProps);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

registerRootComponent(App);