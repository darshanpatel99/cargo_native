import React, { Component } from 'react';
import { View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Colors from '../../constants/Colors'

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
    id: 7,
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
  {
    name: 'clothing',
    id: 13,
    children: [
      {
        name: "men's clothing",
        id: 14,
      },
      {
        name: "women's clothing",
        id: 15,
      },
      {
        name: 'other',
        id: 16,
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
          items={shift}
          uniqueKey="id"
          subKey="children"
          selectText="Availability"
          hideSearch={true}
          showDropDowns={true}
          readOnlyHeadings={true}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
        //single={true}
        colors= {{chipColor: Colors.primary}}
        //   selectToggleIconComponent = "filter-list"
          styles = {{
            backdrop: {
              justifyContent: 'center',
            },
            container: {
              width: '80%',
              height: '60%',
              flex: 0,
              alignSelf: 'center',
              marginTop:50
            }}
          }
        />
      </View>
    );
  }
}