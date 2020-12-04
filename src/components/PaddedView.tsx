import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';

function PaddedView({ children }) {
  return (
    <SafeAreaView>
      <View style={styles.view}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 10,
  }
});

export default PaddedView;