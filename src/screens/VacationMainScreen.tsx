import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, List, Text, useTheme } from '@ui-kitten/components';
import ScreenHeader from '../components/ScreenHeader';
import apiClient from '../utilities/api_client';
import StandardScreenLayout from '../components/StandardScreenLayout';

export default function VacationScreen({ navigation }) {

  const theme = useTheme();

  const [refreshing, setRefreshing] = React.useState(false);
  const [timeOffEntries, setTimeOffEntries] = useState([]);
  const [offset, setOffset] = useState(0);
  const pageSize = 20;

  function loadTimeOffEntries() {
    apiClient.get(`/time_off_entries?limit=${pageSize}&offset=${offset}`)
    .then((response) => {
      setTimeOffEntries([...timeOffEntries, ...response.data]);
      setRefreshing(false);
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadTimeOffEntries();
  }, []);


  return (
    <StandardScreenLayout>
      <ScreenHeader title='Vacation' navigation={navigation} />
      <View style={styles.screenBody}>
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
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </View>
    </StandardScreenLayout>
  );
}

const styles = StyleSheet.create({
  screenBody: {
    flex: 1,
  },
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