import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';

function PaddedView({ style, children }) {
  return (
    <View style={{...styles.view, ...style}}>
      <SafeAreaView>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 10,
  }
});

export default PaddedView;