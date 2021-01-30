import React, { useContext } from 'react';
import SignedInContext from '../contexts/SignedInContext';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Layout, Card, Text } from '@ui-kitten/components';
import ScreenHeader from '../components/ScreenHeader';
import { DashboardScreenProps } from '../utilities/types_and_interfaces';

export default function DashboardScreen({navigation}: DashboardScreenProps) {

  const signedIn = useContext(SignedInContext);

  return (
    <Layout>
      <SafeAreaView>
        <ScreenHeader title='Dashboard' navigation={navigation} />
        <ScrollView>
          <Card style={styles.card}appearance='outline'>
            <Text style={styles.bhtNumber}>?</Text>
            <Text style={styles.bhtCaption}>WBHT</Text>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    alignItems: 'center',
  },
  bhtNumber: {
    textAlign: 'center',
    fontSize: 80,
    fontWeight: 'bold',
  },
  bhtCaption: {
    textAlign: 'center',
    fontSize: 32,
  }
});
