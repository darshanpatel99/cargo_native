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
    name: 'Home Products',
    id: 2,
  },

  {
    name: 'Baby Products',
    id: 3,
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