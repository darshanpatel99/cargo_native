import React, { Component } from 'react';
import { View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Colors from '../../constants/Colors'

const shift = [
      {
        name: 'New : Product has not been unwrapped from the box',
        id: 1,
      },
      {
        name: 'Good : Minor blemishes that most people will not notice',
        id: 2,
      },
      {
        name: 'Satisfactory : Moderate wear and tear, but stil has many good years left',
        id: 3,
      },
      {
        name: 'Age-worn : Has lived a full life and has a "distressed" look with noticeable wear',
        id: 4,
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
      console.log(selectedItems);
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
          selectText="Condition"
          hideSearch={true}
          showDropDowns={true}
          readOnlyHeadings={false}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
          single={true}
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