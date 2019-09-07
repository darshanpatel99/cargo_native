import React, { Component } from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SearchBar } from 'react-native-elements';
import { Font } from "expo";

export default class SearchBarTheme extends Component {
  constructor(props) {
    super(props);
    this.state={
      //text : '', 
      query: "",
      fullData:[],
    }
  }

  // searchFilterFunction = text => {
  //   this.setState({
  //     value: text,
  //   });

  //   console.log(text);

  //   const newData = this.text.filter(item => {
  //     const itemData = `${item.name.title.toUpperCase()} ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
  //     const textData = text.toUpperCase();

  //     return itemData.indexOf(textData) > -1;
  //   });
  //   this.setState({
  //     data: newData,
  //   });
  // };

  handleQueryChange = query =>{
    console.log("Text => " +  query)

    
    this.setState(state => ({ ...state, query: query || "" }));
  }

  render() {  
    return (

      <View style={styles.containerStyle}>
        {/* <TextInput
          style={styles.textInputStyle}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          placeholder={this.props.searchReplacableText}
        /> */}

          <SearchBar        
            placeholder="Type Here..."        
            lightTheme        
            round  
            onChangeText={this.handleQueryChange}  
            value={this.state.query}
            size={20} 
               
           // onChangeText={text => this.handleSearch(text)}   
            //query={this.state.query}                        
          /> 

        {/* <Ionicons
          name="md-search"
          size={32}
          color="#4383FF"
          style={styles.searchIconStyle}
        /> */}

      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: "column",
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
