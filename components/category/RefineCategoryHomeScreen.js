import React, { Component } from 'react';
import { View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Colors from '../../constants/Colors'

const items = [
  // this is the parent or 'item'
  {
    name: 'Categories',
    id: 0,
    // these are the children or 'sub items'
    children: [
      {
        name: 'Clothing',
        id: 1,
      },
      {
        name: 'Furniture',
        id: 2,
      },
      {
        name: 'Sporting Goods, Exercise',
        id: 3,
      },
      {
        name: 'Home-Indoor',
        id: 4,
      },
      {
        name: 'Art, Collectables',
        id: 5,
      },
      {
        name: 'Home Appliances',
        id: 6,
      },
      {
        name: 'Baby Items',
        id: 7,
      },
      {
        name: 'Toys, Games',
        id: 8,
      },
      {
        name: 'Electronics',
        id: 9,
      },
      {
        name: 'Phones',
        id: 10,
      },
      {
        name: 'Computers',
        id: 11,
      },
      {
        name: 'Books',
        id: 12,
      },
      {
        name: 'Other',
        id: 13,
      },
    ],

  },

  {
    name: 'Sorts',
    id: 1,
    children: [
      {
        name: 'All',
        id: 1,
      },
      {
        name: 'High to Low',
        id: 2,
      },
      {
        name: 'Low to High',
        id: 3,
      },
      {
        name: 'New',
        id: 4,
      }
    ],

  },
 

];

export default class extends Component {
  constructor() {
    super();
    this.state = {
      selectedItems: [],
    };
  }
  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
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
          readOnlyHeadings={true}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
          single={true}
          showChips={true}
          showCancelButton={true} 
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