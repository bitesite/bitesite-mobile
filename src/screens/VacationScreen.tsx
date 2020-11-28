import React from 'react';
import { SafeAreaView } from 'react-native';
import { Layout, Button } from '@ui-kitten/components';
import ScreenHeader from '../components/ScreenHeader';

export default function SettingsScreen({ navigation }) {
  return (
    <Layout>
      <SafeAreaView>
        <ScreenHeader title='Vacation' navigation={navigation} />
      </SafeAreaView>
    </Layout>
  );
}