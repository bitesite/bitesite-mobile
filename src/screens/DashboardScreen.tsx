import React from 'react';
import { SafeAreaView } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

export default function DashboardScreen() {
  return (
    <Layout>
      <SafeAreaView>
        <Text category='h1'>Dashboard</Text>
      </SafeAreaView>
    </Layout>
  );
}