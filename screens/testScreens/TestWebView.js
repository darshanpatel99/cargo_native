import React, { Component } from 'react';
import { WebView, View, Text, Button} from 'react-native';
import PaymentPage from './BraintreePayments.html';
import { Constants } from 'expo';



export default class MyWeb extends Component {

    constructor(props){
        super(props)

        this.state={
            webviewState: true,
            responseMessage: '',
            tryAgainButton: false
        }
        
        this._onNavigationStateChange = this._onNavigationStateChange.bind(this);
        this.onMessage = this.onMessage.bind(this)

    }


    _onNavigationStateChange(webViewState){
        console.log("webview state ********************"+webViewState.url)
      }

    injectedToHtml() {
        let injectedData = "document.getElementById('container').innerHTML = '56';";
        return injectedData;
       }

       onMessage(data) {
        //Prints out data that was passed.
        // if(typeof data.SyntheticEvent.nativeEvent !== undefined) {
        //     console.log(data.SyntheticEvent);
        //     console.log(data)
        // }

        console.log(data.nativeEvent.data);
        if(data.nativeEvent.data == "success" ){
            console.log(data.nativeEvent.data)
            this.setState({webviewState: false})
        } else if(data.nativeEvent.data == 'failed') {
            this.setState({responseMessage: 'Please try again'});
            this.setState({tryAgainButton: true})
        }

      }
      
    render() {

        if(this.state.webviewState) {
            return (

                <View style={styles.container}>

<Text>HELLO THETE</Text>
                <WebView
                style={styles.container}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                injectedJavaScript={this.injectedToHtml()}
                onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                useWebKit={true}
                cacheEnabled={false}
                onMessage={this.onMessage}
                source={{ uri: 'http://localhost:3000/'  }}>
                </WebView>

                </View>
            );
        } else {
            return (
            <Button title= {this.state.responseMessage} onPress = { () => { this.setState({webviewState: true}) }}/>
            );
        }
    }
    }
      
      const styles = {
        // container: {
        //   flex: 1,
        //   //alignItems: 'center',
        //   justifyContent: 'center',
      
        // },
        container: {
            flex: 1,
            justifyContent: 'center',
            paddingTop: Constants.statusBarHeight,
            backgroundColor: '#ecf0f1',
            padding: 8,
          },
        video: {
          marginTop: 20,
          maxHeight: 200,
          width: 320,
          flex: 1
        }
      }
  