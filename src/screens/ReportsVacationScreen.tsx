import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button, Icon, Modal, Card } from '@ui-kitten/components';
import StandardScreenLayout from '../components/StandardScreenLayout';
import PaddedView from '../components/PaddedView';
import apiClient from '../utilities/api_client';

function ReportsVacationScreen({ navigation }) {

  const [timeOffEntries, setTimeOffEntries] = useState([]);
  const [approvedModalVisible, setApprovedModalVisible] = useState(false);

  function loadTimeOffEntries() {
    apiClient.get('/time_off_entries?pending_reports_entries=true')
      .then((response) => {
        setTimeOffEntries(response.data);
      });
  }

  function approveIcon(props){
    return <Icon name='checkmark-circle-2-outline' style={styles.icon} {...props} />;
  }

  function handleDonePress() {
    navigation.goBack();
  }

  function handleApprove(timeOffEntryId) {
    apiClient.put(`/time_off_entries/${timeOffEntryId}/approve`)
      .then(() => {
        setApprovedModalVisible(true);
      });
  }

  function handleOkPress() {
    setApprovedModalVisible(false);
    loadTimeOffEntries();
  }

  useEffect(() => {
    loadTimeOffEntries();
  }, []);

  function renderTimeOffEntry({ item }) {
    return (
      <View style={styles.timeOffEntry}>
        <View style={styles.timeOffEntryInfo}>
          <Text style={styles.timeOffEntryDate}>{item.entry_date}</Text>
          <Text>{item.user.name_and_email}</Text>
        </View>
        <Button
          status='primary'
          accessoryLeft={approveIcon}
          onPress={() => {
            handleApprove(item.id)
          }}
        />
      </View>
    );
  }

  return (
    <StandardScreenLayout>
      <Modal
        visible={approvedModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setApprovedModalVisible(false)}
      >
        <Card disabled={true}>
          <View>
            <Text>Entry was approved!</Text>
            <Button onPress={handleOkPress}>Ok</Button>
          </View>
        </Card>
      </Modal>
      <PaddedView>
        <Text category='h5'>Direct Report's Pending Time Off</Text>
      </PaddedView>
      <FlatList
        data={timeOffEntries}
        renderItem={renderTimeOffEntry}
        keyExtractor={item => item.id} 
        style={styles.list}
      />
      <PaddedView>
        <Button
          onPress={handleDonePress}
          appearance='outline'
        >Done</Button>
      </PaddedView>
    </StandardScreenLayout>
  );
};

const styles = StyleSheet.create({
  list: {
    marginTop: 10,
  },
  timeOffEntry: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeOffEntryInfo: {
  },
  timeOffEntryDate: {
    fontWeight: 'bold',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
});

export default ReportsVacationScreen;