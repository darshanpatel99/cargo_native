import React from "react";
import { View, Text, Button, Picker } from "react-native";

export default class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected2: undefined,
      language: "hello"
    };
  }
    render(
      
    ) {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>Test Screen</Text>

          <Picker
  selectedValue={this.state.language}
  style={{height: 50, width: 100}}
  onValueChange={(itemValue, itemIndex) =>
    this.setState({language: itemValue})
  }>
  <Picker.Item label="Java" value="java" />
  <Picker.Item label="JavaScript" value="js" />
</Picker>

        </View>
      );
    }
  }