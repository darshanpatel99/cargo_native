import React from 'react';
import { Icon } from 'native-base'; // Use https://oblador.github.io/react-native-vector-icons/ for icon name and typ
import Colors from '../../constants/Colors';

export default function TabBarIcon(props) {
  const focused = props.focused
    ? Colors.primary
    : Colors.secondary;
  return (
    <Icon type={props.type}
      name={props.name}
      style={[{ marginBottom: -3, fontSize: 25}, {color: '#FBA21C' }]} //Do dynamics color change based on focuse
    />
  );
}
