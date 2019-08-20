import React from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { Button } from 'native-base';


var stripe = require('stripe-client')('pk_test_L2nP2Q4EJa9fa7TBGsLmsaBV00yAW5Pe6c');

let information = {
  card: {
    number: '4242424242424242',
    exp_month: '04',
    exp_year: '21',
    cvc: '999',
    name: 'Sachin Akula'
  }
}

export default class Stripe extends React.Component {
    
      constructor(props) {
        super(props);
        this.state={
          counter: 0,
          token:'',
          valid: false,
          card_number: 0,
          exp_month:0,
          exp_year:0,
          cvc: 0,
          name:'',
          paymentSuccess: false,
        }
        this.sendTokenToStripe = this.sendTokenToStripe.bind(this);
        this.onPayment = this.onPayment.bind(this);
      }
        async onPayment() {
            //alert('Payment processed..')
            let information = {
              card: {
                number: this.state.card_number,
                exp_month: this.state.exp_month,
                exp_year: this.state.exp_year,
                cvc: this.state.cvc,
                name: 'Darsh Boi'
              }
            }
            var card = await stripe.createToken(information);
            console.log(card)
            var token = card.id;
            if('card' in card) {
              alert('card exist');
              this.sendTokenToStripe(token);
            } else {
              console.log(Object.keys(card))
              console.log(card.error.code)
              alert(card.error.message)
              this.sendTokenToStripe(token);
            }
            // this.setState({token})
            //await promisedSetState({token: token});
            // send token to backend for processing
        }

        promisedSetState(newState) {
          console.log(newState);
          console.log('this is new state')
          return new Promise((resolve) => {
              this.setState(newState, () => {
                  resolve()
              });
          });
        }

        sendTokenToStripe =(token) =>{
          console.log('stripe function called');
          console.log(token)
          this.makeLambdaCal(token)
          this.setState({token})
        }


        //AWS lambda function call
        makeLambdaCal(token) {
          fetch('https://5nhq1a2ccj.execute-api.us-west-1.amazonaws.com/dev/processStripePayment', {
            method: 'POST',
            headers: {
              Accept: '*/*',
              'x-api-key': 'oOA7d3dNR84mu2r4795DSaSWnuAvBZDkaVmtwEwJ',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
              'stripeToken': token,
              'charge': '87',
            }),
          });
          console.log('success');
      }


        _onChange = (formData) => {
          //console.log(JSON.stringify(formData, null, " "))
          cardNumber = formData.values.number
          cardNumber = cardNumber.replace(/\s/g, '');
          expiryDate = formData.values.expiry;
          expiryDate = expiryDate.split('/');
          expiryMonth = expiryDate[0]
          expiryYear = expiryDate[1]
          cvc = formData.values.cvc

          if(formData.valid){
            //alert('Card is Valid')
            this.setState({valid:true})
            this.setState({card_number: cardNumber})
            this.setState({exp_month: expiryMonth})
            this.setState({exp_year: expiryYear})
            this.setState({cvc})
            //this.setState({card_number: cardNumber}, {exp_month: expiryMonth}, {exp_year: expiryYear}, {cvc})

          }
          // if()
        };

        
    
        render() {
          const EnabledButton = <Button primary onPress={this.onPayment}><Text style={styles.payButtonText}> Pay Now</Text></Button>
          const DisabledButton = <Button primary disabled onPress={this.onPayment} ><Text style={styles.payButtonText}>Pay Now</Text></Button>

          return (
            <View style={styles.mainContainer}>
              <CreditCardInput onChange={this._onChange} />
              {/* <Button title="Stripe" onPress={this.onPayment}/> */}
              <View style = {styles.payButton}>
                {this.state.valid ? EnabledButton : DisabledButton}
              </View>

            </View>

          );
        
      }
    }
      

const styles= {
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  payButton: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingLeft: 10,
    paddingRight: 10,
  },

  payButtonText: {
    paddingLeft: 10, 
    paddingRight: 10, 
    color: '#fff',
    fontWeight: 800
  }
}