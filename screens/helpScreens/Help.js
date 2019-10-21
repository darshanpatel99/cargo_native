import React from 'react';
import {Image, View, Linking, Platform, Dimensions, Switch, ScrollView, StyleSheet, TouchableOpacity, } from 'react-native';
import { Text, Button } from "native-base";
import Colors from "../../constants/Colors";
//import basic react native components
import * as Animatable from 'react-native-animatable';
//import for the animation of Collapse and Expand
import Collapsible from 'react-native-collapsible';
//import for the collapsible/Expandable view
import Accordion from 'react-native-collapsible/Accordion';
//import for the Accordion view
import Communications from 'react-native-communications';


//You can also use dynamic data by calling web service
const CONTENT = [
  {
    title: 'How long does it take to receive my money once I have sold an item?',
    content:
      'Payment is added to your account within 7 business days of the transaction. We are currently working on a seamless payment transaction, where you would receive your payment within a half hour of the transaction.',
  },
  {
    title: 'When I buy an item, how long does delivery take?',
    content:
      'Our drivers strive to get you your items as quickly as possible. You will have your item no later than one hour after the transaction.',
  },
  {
    title: 'Can I change my delivery address after I have bought an item?',
    content:
      'You will be prompted to update your delivery address before your purchase.',
  },
  {
    title: 'Can I return a purchased item if it is not what was displayed in the ad?',
    content:
      'Yes. You may return a purchased item if the item does not match what was displayed in the ad or the quality is not what was advertised. Upon arrival of your item, you will have a 5 minute window in the app, to either accept the item or return it. If you choose to return the item, you will not be refunded the delivery fee.',
  },
  {
    title: 'Why am I being charged a 5% convenience fee when I buy an item on CarGo Marketplace?',
    content:
      'The 5% convenience fee is charged to the buyer upon a completed transaction. This fee is charged so you can buy and sell completely from the safety of your home. We take care of the rest!',
  },
  // {
  //   title: 'When I sell an item on CarGo Marketplace, when am I charged the 5% convenience fee?',
  //   content:
  //     'When you sell an item on CarGo Marketplace, you will receive 5% less than the price you sold your item for. Example, if you sold an item for $25, you will receive $23.75 back.',
  // },
  {
    title: 'What can I do if my item never makes it to my address? ',
    content:
      'If you haven’t received your item within an hour and a half of your transaction, please send an email to info@meetcargo.com',
  },
  {
    title: 'Will I receive a confirmation email after a transaction?',
    content:
      'Yes, you will always receive a confirmation email after you have purchased or sold an item.',
  },
  {
    title: 'How do I update my delivery and pick up address?',
    content:
      'You may go to your account page and update your delivery or pick up address at any time.',
  },
  {
    title: 'How can I become a CarGo driver?',
    content:
      'We are currently implementing a process of being able to hire CarGo drivers. For now, all deliveries will be done by the CarGo team. If you have any questions. Please email info@meetcargo.com',
  },
  
];

export default class TestScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      //default active selector
      activeSections: [],
      //collapsed condition for the single collapsible
      collapsed: true,
      //multipleSelect is for the Multiple Expand allowed
      //true: You can expand multiple at a time
      //false: One can be expand at a time and other will be closed automatically
      multipleSelect: true,
      }
    this.dialCall = this.dialCall.bind(this);
  }

  dialCall(){ 
    let phoneNumber = '';
    phoneNumber = `${Platform.OS === 'ios' ? 'tel:' : 'tel:'}${12508193073}`;
    Linking.openURL(phoneNumber);
  };

   
  toggleExpanded = () => {
    //Toggling the state of single Collapsible
    this.setState({ collapsed: !this.state.collapsed });
  };
 
  setSections = sections => {
    //setting up a active section state
    this.setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  };
 
  renderHeader = (section, _, isActive) => {
    //Accordion Header view
    return (
      <Animatable.View
        duration={400}
        style={[styles.header, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor">
        <Text style={styles.headerText}>{section.title}</Text>
      </Animatable.View>
    );
  };
 
  renderContent(section, _, isActive) {
    //Accordion Content view
    return (
      <Animatable.View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor">
        <Animatable.Text
          animation={isActive ? 'bounceIn' : undefined}
          style={{ textAlign: 'center' }}>
          {section.content}
        </Animatable.Text>
      </Animatable.View>
    );
  }

  render() {
    const { multipleSelect, activeSections } = this.state;

    return (
      <View style={styles.viewStyle}>

        <View style={styles.logoStyle}>
          <Image
          style={{width: 150, height: 150, borderRadius:20, marginTop:35,}}
          source={require('../../assets/images/support.png')}
          />
          <Text style={{fontSize: 30,fontWeight: 'bold',marginTop:5,}}>FAQ</Text>
        </View>

        <View style={styles.contentStyle}>

          <ScrollView contentContainerStyle={{ paddingTop: 30 }}>
 
          {/*Code for Accordion/Expandable List starts here*/}
          <Accordion
            activeSections={activeSections}
            //for any default active section
            sections={CONTENT}
            //title and content of accordion
            touchableComponent={TouchableOpacity}
            //which type of touchable component you want
            //It can be the following Touchables
            //TouchableHighlight, TouchableNativeFeedback
            //TouchableOpacity , TouchableWithoutFeedback
            expandMultiple={multipleSelect}
            //Do you want to expand mutiple at a time or single at a time
            renderHeader={this.renderHeader}
            //Header Component(View) to render
            renderContent={this.renderContent}
            //Content Component(View) to render
            duration={400}
            //Duration for Collapse and expand
            onChange={this.setSections}
            //setting the state of active sections
          />
          {/*Code for Accordion/Expandable List ends here*/}
        </ScrollView>
        </View>

        <View style={styles.buttonsWithLogo}>

          <Button light rounded large style={styles.secondaryBlueButton} onPress={this.dialCall}>
            <Text style={styles.lightText}>Call</Text>
          </Button>

          <Button light rounded large style={styles.secondaryBlueButton} onPress={() => Communications.email(['support@meetcargo.com', 'info@meetcargo.com'],null,null,'Cargo Support (App)', null)}>
            <Text style={styles.lightText}>Email</Text>
          </Button>

        </View> 

      </View>

    );

  }



}

const styles = {
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
//    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoStyle:{
    flex:0.3,
    flexDirection: 'column',
    alignItems: 'center',
    //justifyContent:'center',
  },
  contentStyle:{
    flex:0.6,
    flexDirection: 'column',
    alignItems: 'center',
    //justifyContent:'center',
  },
  buttonsWithLogo:{
    flex:0.1,
    flexDirection:'row',
    justifyContent:'space-evenly'
  },

  lightText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 1.2
  },
  secondaryBlueButton: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 175,
    margin: 5,
    backgroundColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  multipleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    alignItems: 'center',
  },
  multipleToggle__title: {
    fontSize: 16,
    marginRight: 8,
  },

}