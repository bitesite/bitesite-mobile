import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import PaddedView from '../components/PaddedView';
import {
  Field,
  Actions,
  SubmittingButton,
} from '../components/forms';

import { 
  Layout,
  Text,
  Button,
  RangeDatepicker,
  Select,
  SelectItem,
  IndexPath,
  Input,
  Spinner,
} from '@ui-kitten/components';

import { railsParamsDate } from '../utilities/rails_helpers';

import apiClient from '../utilities/api_client';

export default function TimeOffEntriesFormScreen({ navigation }) {

  const [range, setRange] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [timeOffTypeIndexPath, setTimeOffTypeIndexPath] = useState(new IndexPath(0));
  const [notes, setNotes] = useState('');
  
  const timeOffTypes = ['Vacation Day', 'Sick Day', 'Unpaid Vacation'];


  function handleSubmitPress() {
    setSubmitting(true);
    const startDate = railsParamsDate(range.startDate);
    const endDate = range.endDate ? railsParamsDate(range.endDate) : railsParamsDate(range.startDate)
    
    apiClient.post('/time_off_entries/bulk_create',
    {
      start_date: startDate,
      end_date: endDate,
      time_off_type: timeOffTypes[timeOffTypeIndexPath.row],
      notes
    })
    .then(() => {
      navigation.goBack();
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  function handleCancelPress() {
    navigation.goBack();
  }

  return (
    <Layout>
      <PaddedView>
        <Text category='h1'>Book time off</Text>
        <Field>
          <RangeDatepicker 
            label='Dates'
            placeholder='Pick your dates'
            range={range}
            onSelect={nextRange => setRange(nextRange)}
          />
        </Field>
        <Field>
          <Select
            label='Type'
            selectedIndex={timeOffTypeIndexPath}
            onSelect={indexPath => setTimeOffTypeIndexPath(indexPath)}
            value={timeOffTypes[timeOffTypeIndexPath.row]}>
            {
              timeOffTypes.map(timeOffType => <SelectItem key={timeOffType} title={timeOffType} />)
            }
          </Select>
        </Field>
        <Field>
          <Input
            multiline={true}
            textStyle={{ minHeight: 64 }}
            label='Notes'
            placeholder='Enter your notes'
            value={notes}
            onChangeText={(text) => setNotes(text)}
          />
        </Field>
        <Actions style={styles.actions}>
          <SubmittingButton 
            color='primary'
            onPress={handleSubmitPress}
            submitting={submitting}
          >
            Submit
          </SubmittingButton>
          <Button 
            appearance='ghost'
            onPress={handleCancelPress}
          >
            Cancel
          </Button>
        </Actions>
      </PaddedView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
  }
});