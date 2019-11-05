import React , {Component} from 'react'
import {View, Text} from 'react-native';
import {navigation} from 'react-navigation';
import {Input,} from 'native-base';
import { styles } from 'ansi-colors';

export default class extends Component {

 constructor(props){
    super(props)
    

    const preCondition = this.props.preChoice;


     this.state = {
      fic : preCondition.fic,
      deliveryProvider : preCondition.deliveryProvider,
      age:preCondition.age,
      brandName:preCondition.brandName,
      dimensionsWidth :preCondition.dimensionsWidth,
      dimensionHeight: preCondition.dimensionHeight,
      dimensionLength: preCondition.dimensionLength,
      color: preCondition.color,
      condition : preCondition.condition,
     }
 }
  
    render() {
      return (
          <View style = {boxStyle.container}>
            <View>
            <Input
               placeholder="Brand Name"
               name="Brand" 
               onChangeText={(text)=>this.setState({brandName:text})}
               value={this.state.brandName}
               maxLength={50}
               returnKeyType='done'
              />

              <Input
               placeholder="Width"
               name="width" 
               onChangeText={(text)=>this.setState({dimensionsWidth:text})}
               value={this.state.dimensionsWidth}
               maxLength={50}
               returnKeyType='done'
              />

              <Input
               placeholder="Height"
               name="height" 
               onChangeText={(text)=>this.setState({dimensionHeight:text})}
               value={this.state.dimensionHeight}
               maxLength={50}
               returnKeyType='done'
              />

              <Input
               placeholder="Length"
               name="length" 
               onChangeText={(text)=>this.setState({dimensionLength:text})}
               value={this.state.dimensionLength}
               maxLength={50}
               returnKeyType='done'
              />

              <Input
               placeholder="Condition"
               name="condition" 
               onChangeText={(text)=>this.setState({condition:text})}
               value={this.state.condition}
               maxLength={50}
               returnKeyType='done'
              />


            </View>

          </View>
      );
    }
  }

 const boxStyle = {
   container:{
     borderWidth:0.5,
     borderColor:'black',
   }
 }