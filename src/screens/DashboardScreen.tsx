import React, { useContext } from 'react';
import SignedInContext from '../contexts/SignedInContext';
import { SafeAreaView } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import ScreenHeader from '../components/ScreenHeader';

export default function DashboardScreen({navigation}) {

  const signedIn = useContext(SignedInContext);

  return (
    <Layout>
      <SafeAreaView>
        <ScreenHeader title='Dashboard' navigation={navigation} />
      </SafeAreaView>
    </Layout>
  );
}