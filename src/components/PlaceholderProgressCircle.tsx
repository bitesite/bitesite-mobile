import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

function PlaceholderProgressCircle({text}) {
  return (
    <View style={styles.placeHolderProgressCircle}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeHolderProgressCircle: {
    backgroundColor: '#eeeeee',
    borderStyle: 'dashed',
    borderWidth: 2,
    width: 200,
    height: 200,
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#888888',
  }
});

export default PlaceholderProgressCircle;