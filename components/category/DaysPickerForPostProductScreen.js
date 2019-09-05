import React, { Component } from 'react';
import { View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const shift = [
  // this is the parent or 'item'
  {
    name: 'Weekdays',
    id: 0,
    // these are the children or 'sub items'
    children: [
      {
        name: 'Morning  7am to 12pm',
        id: 1,
      },
      {
        name: 'Afternoon 12pm to 5pm',
        id: 2,
      },
      {
        name: 'Evening 5pm to 10pm',
        id: 3,
      },
    ],

  },
  {
    name: 'Weekends',
    id: 1,
    // these are the children or 'sub items'
    children: [
      {
        name: 'Morning  7am to 12pm',
        id: 4,
      },
      {
        name: 'Afternoon 12pm to 5pm',
        id: 5,
      },
      {
        name: 'Evening 5pm to 10pm',
        id: 6,
      },
    ],

  },



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
          items={shift}
          uniqueKey="id"
          subKey="children"
          selectText="Avability"
          showDropDowns={true}
          readOnlyHeadings={true}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
        //single={true}  
              
        />
      </View>
    );
  }
}