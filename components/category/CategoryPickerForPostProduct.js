import React, { Component } from 'react';
import { View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const items = [
  // this is the parent or 'item'
  {
    name: 'Electronics',
    id: 1,

  },

  {
    name: 'Home Products',
    id: 2,
  },

  {
    name: 'Baby Products',
    id: 3,
  }

];

export default class extends Component {
  constructor() {
    super();
    this.state = {
      selectedItems:[],
    };
  }
  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
    console.log(typeof selectedItems);
    this.props.parentCallback(selectedItems);
  };

  changeState = () => {
    this.setState({
      selectedItems: [],
    });
  };

  render() {
    return (
        <View >
        <SectionedMultiSelect
          items={items}
          uniqueKey="id"
          subKey="children"
          selectText="Select Category"
          showDropDowns={true}
          readOnlyHeadings={false}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
          single={true}  
              
        />
      </View>
    );
  }
}