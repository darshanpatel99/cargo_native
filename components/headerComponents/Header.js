import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Colors from '../../constants/Colors';
import Logo from '../theme/logo';

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.containerStyle}>
        <Logo />
      </View>
    </View>
  );
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    height: 120,
    //borderBottomLeftRadius: 90,
    //borderBottomRightRadius: 90,
    shadowColor: '#ddd',
    shadowOpacity: 0.7,
    shadowOffset: {
      width: 2,
      height: 2
    },
    zIndex: 2
  },
};
