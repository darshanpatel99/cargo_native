import React, { Component } from 'react';
import { View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Colors from '../../constants/Colors'

const items = [
  // this is the parent or 'item'
  {
    name: 'Arts & Collectibles',
    id: 1,
  },
  {
    name: 'Audio',
    id: 2,
  },
  {
    name: 'Auto Parts',
    id: 3,
  },
  {
    name: 'Baby Items',
    id: 4,
  },

  {
    name: 'Bikes',
    id: 5,
    children: [
      {
        name: 'Men’s',
        id: 6,
      },
      {
        name: 'Women’s ',
        id: 7,
      },
      {
        name: 'Children’s',
        id: 8,
      },
    ],
  },

  {
    name: 'Books',
    id: 9,
  },
  {
    name: 'Cameras & Camcorders',
    id: 10,
  },
  {
    name: 'CDs, DVDs, & Blu-ray',
    id: 11,
  },


  {
    name: 'Clothing',
    id: 12,
    children: [
      {
        name: 'Men’s',
        id: 13,
      },
      {
        name: 'Women’s',
        id: 14,
      },
      {
        name: 'Children’s ',
        id: 15,
      },
      {
        name: 'Infants',
        id: 16,
      },
    ],
  },
  {
    name: 'Computers',
    id: 17,
  },
  {
    name: 'Electronics',
    id: 18,
  },

  {
    name: 'Furniture',
    id: 19,
    children: [
      {
        name: "Tables",
        id: 20,
      },
      {
        name: "Chairs",
        id: 21,
      },
      {
        name: 'End Tables',
        id: 22,
      },
      {
        name: 'Dressers',
        id: 23,
      },
      {
        name: 'Book Shelves',
        id: 24,
      },
    ],
  },

  {
    name: 'Gift Cards',
    id: 25,
  },
  {
    name: 'Hobbies and Crafts',
    id: 26,
  },
  

  {
    name: 'Home indoor Items',
    id: 27,
    children: [
      {
        name: 'Cutlery',
        id: 28,
      },
      {
        name: 'Plants',
        id: 29,
      },
      {
        name: 'Plates, Bowls, Cups & dishes ',
        id: 30,
      },
    ],
  },
  {
    name: 'Home outdoor Items',
    id: 31,
    children: [
      {
        name: 'Hoses',
        id: 32,
      },
      {
        name: 'Sprinklers',
        id: 33,
      },
      {
        name: 'Landscape Materials',
        id: 34,
      },
      {
        name: 'Planters ',
        id: 35,
      },
      {
        name: 'Lawn care',
        id: 36,
      },
    ],
  },
  {
    name: 'Jewelry & Watches',
    id: 37,
  },
  {
    name: 'Musical Instruments',
    id: 38,
  },
  {
    name: 'Phones',
    id:39,
  },

  {
    name: 'Sporting Goods & Exercise',
    id: 40 ,
    children: [
      {
        name: 'Weights',
        id: 41,
      },
      {
        name: 'Cleats',
        id: 42,
      },
      {
        name: 'Shin Guards',
        id: 43,
      },
      {
        name: 'Baseball Bats',
        id: 44,
      },
      {
        name: 'Hockey Sticks',
        id: 45,
      },
      {
        name: 'Hockey Gear',
        id: 46,
      },
      {
        name: 'Skates',
        id: 47,
      },
      {
        name: 'Golf Clubs & Gear',
        id: 48,
      },
      {
        name: 'Golf Balls',
        id: 49,
      },
    ],
  },

  {
    name: 'Shoes',
    id: 50,
  },
  {
    name: 'Tickets',
    id: 51,
  },
  {
    name: 'Toys & Games',
    id: 52,
  },
  {
    name: 'TVs & Video',
    id: 53,
  },
  {
    name: 'Video Games & Consoles',
    id: 54,
  },
  {
    name: 'Other',
    id: 55,
  },
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
          selectText=" Filter"
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
              width: '90%',
              height: '80%',
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