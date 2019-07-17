import React from 'react';
import { View, Text } from 'react-native';

export default function Logo() {
  return (
    <View>
      <Text style={styles.logoText}>CarGo</Text>
    </View>
  );
}

const styles = {
  logoText: {
    fontFamily: 'origo',
    fontSize: 60,
    color: '#fff',
    marginTop: 30
  }
};
