import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, List, Text, useTheme } from '@ui-kitten/components';
import ScreenHeader from '../components/ScreenHeader';
import apiClient from '../utilities/api_client';
import StandardScreenLayout from '../components/StandardScreenLayout';
import { Calendar } from 'react-native-calendars';

export default function VacationScreen({ navigation }) {

  const theme = useTheme();

  const [refreshing, setRefreshing] = React.useState(false);
  const [timeOffEntries, setTimeOffEntries] = useState([]);
  
  function loadTimeOffEntries() {
    apiClient.get(`/time_off_entries`)
    .then((response) => {
      setTimeOffEntries(response.data);
      setRefreshing(false);
    })
  }

  function handleBookTimeOffPress() {
    navigation.navigate('VacationForm');
  }

  useEffect(loadTimeOffEntries, []);

  const markedDates = {}
  timeOffEntries.forEach((timeOffEntry) => {
    const marking = {marked: true};
    if(timeOffEntry.status === 'Pending') {
      marking.dotColor = '#BBBB66';
    } else if(timeOffEntry.status === 'Approved') {
      marking.dotColor = 'green';
    }
    
    markedDates[timeOffEntry.entry_date] = marking;
  });

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
        <Calendar 
          markedDates={markedDates}
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