import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import MainButton from "../../components/theme/MainButton";

export default class LoginScreen extends Component {
  render() {
    return (
      <View style={styles.viewStyle}>
        <MainButton title="Sign in" />
        <MainButton
          title="Siqn Up with Facebook"
          isIcon={true}
          icon="logo-facebook"
        />
        <MainButton
          title="Sign Up with Google"
          isIcon="true"
          icon="logo-google"
        />
        <MainButton secondary="true" title="Sign Up" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "flex-end"
  }
});
