import React, { Component } from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Font } from "expo";

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          placeholder={this.props.searchReplacableText}
        />
        <Ionicons
          name="md-search"
          size={32}
          color="#4383FF"
          style={styles.searchIconStyle}
        />

        <Text style={styles.textRefineStyle}>
          | Refine
        </Text>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: "row",
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10
  },

  textInputStyle: {
    borderColor: "#F7F2F2",
    borderWidth: 1,
    backgroundColor: "#f9f7f0",
    height: 40,
    borderRadius: 20,
    width: "70%",
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 10
  },

  searchIconStyle: {
    fontWeight: "900",
    marginLeft: 10,
    marginTop: 5,
    marginRight: 2
  },

  textRefineStyle:{
    marginLeft: 10,
    marginTop: 5,
    marginRight: 2,
    fontSize: 20,
  }

};
