import React, { Component } from 'react';
import { View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const items = [
  // this is the parent or 'item'
  {
    name: 'Electronics',
    id: 1,
    children: [
      {
        name: 'Mobile Phone',
        id: 2,
      },
      {
        name: 'Computers',
        id: 3,
      },
      {
        name: 'Other Electronics',
        id: 4,
      },
    ],
  },

  {
    name: 'Home Products',
    id: 5,
    children: [
      {
        name: 'Home Décor',
        id: 6,
      },
      {
        name: 'Kitchen and dining wares',
        id: 7,
      },
      {
        name: 'Other Home Products',
        id: 8,
      },
    ],
  },

  {
    name: 'Baby Products',
    id: 9,
    children: [
      {
        name: 'Clothing',
        id: 10,
      },
      {
        name: 'Toys',
        id: 11,
      },
      {
        name: 'Cribs',
        id: 12,
      },
    ],
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
          readOnlyHeadings={true}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
          single={true}  
              
        />
      </View>
    );
  }
}