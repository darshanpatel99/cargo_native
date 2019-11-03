import React, { Component } from 'react';
import { View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Colors from '../../constants/Colors'

const items = [
  // this is the parent or 'item'
  {
    name: 'Beds',
    id: 1,
    children: [
      {
        name: 'Cribs',
        id: 2,
      },
      {
        name: 'Daybeds',
        id: 3,
      },
      {
        name: 'Full beds',
        id: 4,
      },
      {
        name: 'Headboards',
        id: 5,
      },
      {
        name: 'King beds',
        id: 6,
      },
      {
        name: 'Loft & Bunk Beds',
        id: 7,
      },
      {
        name: 'Queen beds',
        id: 8,
      },
      {
        name: 'Twin Beds',
        id: 9,
      },
    ],
  },
  {
    name: 'Chairs',
    id: 10,
    children: [
      {
        name: 'Accent Chairs',
        id: 11,
      },
      {
        name: 'Armchairs',
        id: 12,
      },
      {
        name: 'Benches',
        id: 13,
      },
      {
        name: 'Chair and a Half',
        id: 14,
      },
      {
        name: 'Dining Chairs',
        id: 15,
      },
      {
        name: 'Nursing Chairs',
        id: 16,
      },
      {
        name: 'Office Chairs',
        id: 17,
      },
      {
        name: 'Ottomans and Footstools',
        id: 18,
      },
      {
        name: 'Recliners',
        id: 19,
      },
      {
        name: 'Stools',
        id: 20,
      },
    ],
  },
  {
    name: 'Décor',
    id: 21,
    children: [
      {
        name: 'Mirrors',
        id: 22,
      },
      {
        name: 'Other Décor',
        id: 23,
      },
      {
        name: 'Pillows',
        id: 24,
      },
      {
        name: 'Wall Art',
        id: 25,
      },
      
    ],
  },
  {
    name: 'Lighting',
    id: 26,
    children: [
      {
        name: 'Ceiling Lamps',
        id: 27,
      },
      {
        name: 'Floor Lamps',
        id: 28,
      },
      {
        name: 'Table Lamps',
        id: 29,
      },
      {
        name: 'Wall Lamps',
        id: 30,
      },
      
    ],
  },

  {
    name: 'Rugs',
    id: 31,
    children: [
      {
        name: 'Area Rugs',
        id: 32,
      },
      {
        name: 'Small Rugs',
        id: 33,
      },
    ],
  },

  {
    name: 'Sofas',
    id: 34,
    children: [
      {
        name: '2 Piece Sectionals',
        id: 35,
      },
      {
        name: '2 Seater Sofas',
        id: 36,
      },
      {
        name: '3+ Piece Sectionals',
        id: 37,
      },
      {
        name: '3+ Seater Sofas',
        id: 38,
      },
      {
        name: 'Chaise Lounge',
        id: 39,
      },
      {
        name: 'Futons',
        id: 40,
      },
      {
        name: 'Loveseats',
        id: 41,
      },
      {
        name: 'Sleeper Sofas',
        id: 42,
      },
    ],
  },

  {
    name: 'Tables',
    id: 43,
    children: [
      {
        name: 'Changing Tables',
        id: 44,
      },
      {
        name: 'Coffee Tables',
        id: 45,
      },
      {
        name: 'Desks',
        id: 46,
      },
      {
        name: 'Dining Sets',
        id: 47,
      },
      {
        name: 'Dining Tables',
        id: 48,
      },
      {
        name: 'Side Tables',
        id: 49,
      },
      
    ],
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