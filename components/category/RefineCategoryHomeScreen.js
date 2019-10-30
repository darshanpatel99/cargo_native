import React, { Component } from 'react';
import { View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Colors from '../../constants/Colors'

const items = [
  // this is the parent or 'item'
  {
    name: 'Electronics',
    id: 1,
  },
  {
    name: 'Home',
    id: 3,
  },
  {
    name: 'Fashion',
    id: 4,
  },
  {
    name: 'Pet',
    id: 5,
  },
  {
    name: 'Garden',
    id: 6,
  },
  {
    name: 'Sports',
    id: 7,
  },
  {
    name: 'Entertainment',
    id: 8,
  },
  {
    name: 'Family',
    id: 9,
  },
  {
    name: 'Hobbies',
    id: 10, 
  },
  {
    name: 'Others',
    id: 2,
  },
]

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