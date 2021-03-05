import React, { useState, useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import ScreenHeader from '../components/ScreenHeader';
import { AccountScreenProps } from '../utilities/types_and_interfaces';
import PaddedView from '../components/PaddedView';
import apiClient from '../utilities/api_client';
import { Ionicons } from '@expo/vector-icons';

export default function AccountScreen({ navigation }: AccountScreenProps) {

  const [profile, setProfile] = useState();

  function loadProfile() {
    apiClient.get('/profile').then((response) => {
      setProfile(response.data);
    })
    .catch((error) => {
      console.log("Could not fetch profile.");
      console.log(error);
    });
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <Layout>
      <SafeAreaView>
        <ScreenHeader title='Account' navigation={navigation} />
        {
          profile &&
          <PaddedView style={{ alignItems: 'center', paddingVertical: 20, }}>
            <Ionicons name="person-circle-outline" size={120} color="#aaaaaa" />
            <Text style={{ fontWeight: 'bold', fontSize: 18, }}>{profile.first_name} {profile.last_name}</Text>
            <Text>{profile.email}</Text>
            <Text>WBHT: {profile.weekly_billable_hours_target}</Text>
          </PaddedView>
        }
      </SafeAreaView>
    </Layout>
  );
}