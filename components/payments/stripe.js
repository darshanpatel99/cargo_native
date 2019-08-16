import React from 'react';
import {Button, View, Text} from 'react-native'
var stripe = require('stripe-client')('pk_test_L2nP2Q4EJa9fa7TBGsLmsaBV00yAW5Pe6c');

let information = {
  card: {
    number: '4242424242424242',
    exp_month: '02',
    exp_year: '21',
    cvc: '999',
    name: 'Billy Joe'
  }
}

export default class Stripe extends React.Component {
    
      constructor(props) {
        super(props);
        this.state={
          counter: 0
        }
      }
        async onPayment() {
            //alert('Payment processed..')
            var card = await stripe.createToken(information);
            var token = card.id;
            alert(token);
            // send token to backend for processing
        }
    
        render() {
    
          return (
            <Button title="Stripe" onPress={this.onPayment}/>
          );
        
      }
    }
      


// var information = {
//   card: {
//     number: '4242424242424242',
//     exp_month: '02',
//     exp_year: '21',
//     cvc: '999',
//     name: 'Billy Joe'
//   }
// }

// export class Stripe extends React.Component {

//     constructor(){
//         super();
//     }

// //   async onPayment() {
// //     var card = await stripe.createToken(information);
// //     var token = card.id;
// //     // send token to backend for processing
// //   }

//   render() {
//     return (
//         <View><Button title= "Stripe"/></View>
//     )
//   }
// }