import React, { Component } from 'react';
import { View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Colors from '../../constants/Colors'

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

export default class RefineCategoryHomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      selectedItems: [],
    };
  }
  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
    this.props.parentCallback(selectedItems);
    console.log(selectedItems)
  };



  render() {
    return (
        <View >
        <SectionedMultiSelect
          items={items}
          uniqueKey="id"
          hideSelect={false}
          subKey="children"
          selectText="Refine"
          showDropDowns={true}
          readOnlyHeadings={false}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
          single={false}
          showChips={true}
          showCancelButton={true}
          showRemoveAll ={true}
          removeAllText= "Remove All"
          colors= {{chipColor: Colors.primary}}
        //   selectToggleIconComponent = "filter-list"
          styles = {{
            backdrop: {
              justifyContent: 'center',
            },
            container: {
              width: '100%',
              height: '80%',
              flex: 0,
              alignSelf: 'center',
            }}
          }
        />
      </View>
    );
  }
}