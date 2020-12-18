import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Layout } from '@ui-kitten/components';

function StandardScreenLayout({ children }) {
  return (
    <Layout style={styles.layout}>
      <SafeAreaView style={styles.safeAreaView}>
        {children}
      </SafeAreaView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
});

export default StandardScreenLayout;