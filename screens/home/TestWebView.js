import React, { Component } from 'react';
import { WebView, View, Text, Button} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

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
        let injectedData = "document.getElementById('container').innerHTML = "+this.props.TotalCartAmount+";";
        return injectedData;
       }

       onMessage(data) {
        //Prints out data that was passed.
        // if(typeof data.SyntheticEvent.nativeEvent !== undefined) {
        //     console.log(data.SyntheticEvent);
        //     console.log(data)
        // }
        const { navigate } = this.props.navigation;

        console.log(data.nativeEvent.data);
        if(data.nativeEvent.data == "success" ){
            console.log(data.nativeEvent.data)
            //this.setState({webviewState: false})
            const resetAction = StackActions.reset({
                index: 0, // <-- currect active route from actions array
                //params: {userId: this.state.UID},
                actions: [
                  NavigationActions.navigate({ routeName: 'PaymentSuccessScreen', params: { responseMessage: this.state.responseMessage, navigation: this.props.navigation }} ),
                ],
              });
              this.props.navigation.dispatch(resetAction);
        } else if(data.nativeEvent.data == 'failed') {
            this.setState({responseMessage: 'Please try again'});
            this.setState({tryAgainButton: true})
        }

      }
      
    render() {

        if(this.state.webviewState) {
            return (

                <View style={styles.container}>

                <WebView
                    style={styles.container}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    injectedJavaScript={this.injectedToHtml()}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                    useWebKit={true}
                    cacheEnabled={false}
                    onMessage={this.onMessage}
                    source={{ uri: 'http://35.232.190.65:3000/'  }}>
                </WebView>

                </View>
            );
        } else {
            return (
                <View>
                    <Text>Thanks for choosing CarGo</Text>
                    <Text>You will be notified before delivery</Text>
                </View>
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
  