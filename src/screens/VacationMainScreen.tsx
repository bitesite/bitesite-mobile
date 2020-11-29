import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Layout, Card, List, Text, useTheme } from '@ui-kitten/components';
import ScreenHeader from '../components/ScreenHeader';
import apiClient from '../utilities/api_client';

export default function VacationScreen({ navigation }) {

  const theme = useTheme();

  const [timeOffEntries, setTimeOffEntries] = useState([]);
  const [offset, setOffset] = useState(0);
  const pageSize = 20;

  function loadTimeOffEntries() {
    apiClient.get(`/time_off_entries?limit=${pageSize}&offset=${offset}`)
    .then((response) => {
      setTimeOffEntries([...timeOffEntries, ...response.data]);
    })
  }
  
  function renderNewsItem({ item: timeOffEntry }) {

    let statusColor;
    switch(timeOffEntry.status) {
      case 'Pending':
        statusColor = theme['color-warning-default'];
        break;
      case 'Approved':
        statusColor = theme['color-success-default'];
        break;
    }

    return (
      <Card style={styles.timeOffEntryCard}>
        <View style={styles.timeOffEntryCardBody}>
          <View style={{...styles.timeOffEntryStatus, backgroundColor: statusColor}} />
          <Text>{timeOffEntry.entry_date}</Text>
        </View>
        <Text style={styles.timeOffEntryNotes}appearance='hint'>{timeOffEntry.notes}</Text>
      </Card>
    );
  }

  function handleListEndReached() {
    setOffset(offset + pageSize);
  }

  function handleBookTimeOffPress() {
    navigation.navigate('VacationForm');
  }

  useEffect(loadTimeOffEntries, [offset]);
  useEffect(loadTimeOffEntries, []);


  return (
    <Layout>
      <SafeAreaView>
        <ScreenHeader title='Vacation' navigation={navigation} />
        <View style={styles.buttonContainer}>
          <Button
            color='primary'
            onPress={handleBookTimeOffPress}
          >
            Book time off
          </Button>
        </View>
        <List
          style={styles.timeOffEntriesList}
          data={timeOffEntries}
          renderItem={renderNewsItem}
          onEndReached={handleListEndReached}
          onEndReachedThreshold={1}
        />
      </SafeAreaView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 10,
  },
  timeOffEntriesList: {
  },
  timeOffEntryStatus: {
    height: 10,
    width: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  timeOffEntryCard: {
    marginTop: 10,
    marginHorizontal: 10,
  },
  timeOffEntryCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeOffEntryNotes: {
    marginTop: 10,
  }
});