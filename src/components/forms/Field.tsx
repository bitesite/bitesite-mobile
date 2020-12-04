import React from 'react';
import { View, StyleSheet } from 'react-native';

function Field(props) {
  return (
    <View style={styles.view} {...props}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    marginTop: 10,
    marginBottom: 10,
  }
});

export default Field;