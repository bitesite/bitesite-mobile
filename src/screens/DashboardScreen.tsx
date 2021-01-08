import React, { useContext } from 'react';
import SignedInContext from '../contexts/SignedInContext';
import { SafeAreaView } from 'react-native';
import { Layout } from '@ui-kitten/components';
import ScreenHeader from '../components/ScreenHeader';
import { DashboardScreenProps } from '../utilities/types_and_interfaces';

export default function DashboardScreen({navigation}: DashboardScreenProps) {

  const signedIn = useContext(SignedInContext);

  return (
    <Layout>
      <SafeAreaView>
        <ScreenHeader title='Dashboard' navigation={navigation} />
      </SafeAreaView>
    </Layout>
  );
}