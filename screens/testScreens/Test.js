import React from "react";
import { View, Text, Button } from "react-native";
import { SearchBar } from 'react-native-elements';

export default class TestScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query: "",
    };

  }
  handleQueryChange = query =>{
    console.log("Text => " +  query)
    this.setState(state => ({ ...state, query: query || "" }));
  }

  handleSearch = (text) => {
    console.log("Text => " +  text)
    this.setState({ query : text })
  }

    render() {

      return (
        <View >
          <Text>Test Screen</Text>

          <SearchBar        
            placeholder="Type Here..."        
            lightTheme        
            round  
            onChangeText={this.handleQueryChange}  
            value={this.state.query}    
           // onChangeText={text => this.handleSearch(text)}   
            //query={this.state.query}                        
          /> 

        </View>
      );
    }
  }