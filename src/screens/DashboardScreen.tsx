import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Layout } from '@ui-kitten/components';
import ScreenHeader from '../components/ScreenHeader';
import { DashboardScreenProps } from '../utilities/types_and_interfaces';
import WeeklyBillableHoursProgress from '../components/WeeklyBillableHoursProgress';

export default function DashboardScreen({navigation}: DashboardScreenProps) {
  return (
    <Layout>
      <SafeAreaView>
        <ScreenHeader title='Dashboard' navigation={navigation} />
        <ScrollView>
          <WeeklyBillableHoursProgress />
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
}
