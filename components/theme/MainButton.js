/*-----------------------------------------------------------------------
  We have two buttons, primary and secondary. Primary sets the button to
  the priamry color, secondary sets the button color to white, with 
  primary color text. Can also take an icon as a prop.
  
  props
    title         string
    secondary     bool
    isIcon        bool
    icon          name of the IonIcon
  
  Size of all these props are static for now.

  How to use:
    <MainButton 
    title=<Text on button> 
    isIcon=<boolean> 
    secondary=<boolean>
    icon=<name of icon>
    />

  Examples:
    Basic button
      <MainButton title="Log in" />
    
    Button with icon
      <MainButton 
      title="Facebook Login" 
      isIcon="true" 
      icon="logo-facebook" />

    Secondary button
      <MainButton 
      secondary="true" 
      title="Sign Up" />
    
    Secondary button with icon
      <MainButton 
      secondary="true" 
      title="Sign Up" 
      isIcon="true" 
      icon="<icon name>"/>
-----------------------------------------------------------------------*/

import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "native-base";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default class MainButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <View>{this.renderButton()}</View>;
  }

  renderButton() {
    if (this.props.isIcon) {
      if (this.props.secondary) {
        // Secondary button with icon
        return (
          <Button light rounded large style={styles.secondaryButton}>
            <Ionicons
              size={30}
              color={Colors.primary}
              style={styles.icon}
              name={this.props.icon}
            />
            <Text style={styles.secondaryText}>{this.props.title}</Text>
          </Button>
        );
      }
      // Primary button with icon
      else {
        return (
          <Button primary rounded large style={styles.button}>
            <Ionicons
              size={30}
              color="#fff"
              style={styles.icon}
              name={this.props.icon}
            />
            <Text style={styles.lightText}>{this.props.title}</Text>
          </Button>
        );
      }
    } else {
      if (this.props.secondary) {
        // Secondary button
        return (
          <Button light rounded large style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>{this.props.title}</Text>
          </Button>
        );
      } else {
        // Button
        return (
          <Button primary rounded large style={styles.button}>
            <Text style={styles.lightText}>{this.props.title}</Text>
          </Button>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 300,
    margin: 5,
    backgroundColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5
  },
  secondaryButton: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 300,
    margin: 5
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 1.2
  },
  secondaryText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 1.2
  },
  lightText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 1.2
  },
  icon: {
    padding: 5,
    paddingRight: 10
  }
});
