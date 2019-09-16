import React, { Component } from "react";
import { View, } from "react-native";
import { SearchBar } from 'react-native-elements';

export default class SearchBarTheme extends Component {
  constructor(props) {
    super(props);
    this.state={
      //text : '', 
      query: "",
      fullData:[],
    }
  }

  handleQueryChange = query =>{
    console.log("Text => " +  query)

    
    this.setState(state => ({ ...state, query: query || "" }));
  }

  render() {  
    return (

      <View style={styles.containerStyle}>

          <SearchBar        
            placeholder="Type Here..."        
            lightTheme        
            round  
            onChangeText={this.handleQueryChange}  
            value={this.state.query}
            size={20}                       
          /> 
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
