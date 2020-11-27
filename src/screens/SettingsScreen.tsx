import React from 'react';
import { SafeAreaView } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';

export default function SettingsScreen() {
  return (
    <Layout>
      <SafeAreaView>
        <Text category='h1'>Settings</Text>
        <Button>Sign out</Button>
      </SafeAreaView>
    </Layout>
  );
}