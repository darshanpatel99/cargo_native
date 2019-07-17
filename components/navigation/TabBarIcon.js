import React from 'react';
import { Icon } from 'native-base'; // Use https://oblador.github.io/react-native-vector-icons/ for icon name and typ
import Colors from '../../constants/Colors';

export default function TabBarIcon(props) {
  const focused = props.focused
    ? Colors.tabIconSelected
    : Colors.tabIconDefault;
  return (
    // <Ionicons
    //   name={props.name}
    //   size={26}
    //   style={{ marginBottom: -3 }}
    //   color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    // />
    // ios={props.iosname} android={props.androidname}

    <Icon type={props.type}
      name={props.name}
      style={[{ marginBottom: -3, fontSize: 25}, {color: '#FBA21C' }]} //Do dynamics color change based on focuse
    />
  );
}

