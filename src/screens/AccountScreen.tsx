import React from 'react';
import { SafeAreaView } from 'react-native';
import { Layout } from '@ui-kitten/components';
import ScreenHeader from '../components/ScreenHeader';
import { AccountScreenProps } from '../utilities/types_and_interfaces';

export default function AccountScreen({ navigation }: AccountScreenProps) {
  return (
    <Layout>
      <SafeAreaView>
        <ScreenHeader title='Account' navigation={navigation} />
      </SafeAreaView>
    </Layout>
  );
}