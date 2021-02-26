import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Spinner, Text, useTheme } from '@ui-kitten/components';
import freshbooks_api_client from '../utilities/freshbooks_api_client';
import numeral from 'numeral';
import moment from 'moment';
import StyledProgressCircle from './StyledProgressCircle';

function WeeklyBillableHoursProgress() {
  
  const theme = useTheme();

  const [checkingFreshbooksAuth, setCheckingFreshbooksAuth] = useState(false);
  const [launchingFreshbooksLogin, setLaunchingFreshbooksLogin] = useState(false);
  const [freshbooksAuthorized, setFreshbooksAuthorized] = useState(false);
  const [loadingCurrentWeeklyBillableHours, setLoadingCurrentWeeklyBillableHours] = useState(true);
  const [currentWeeklyBillableHours, setCurrentWeeklyBillableHours] = useState(0);

  function authorizeFreshbooks() {
    setLaunchingFreshbooksLogin(true);
    freshbooks_api_client.authorize()
    .then(() => {
      checkFreshbooksAuth();
    })
    .catch(() => {
      console.log("Authorize error!");
    });;
  }

  function checkFreshbooksAuth() {
    setCheckingFreshbooksAuth(true);
    freshbooks_api_client.checkAuthorization()
    .then((authorized) => {
      setFreshbooksAuthorized(authorized);
      setCheckingFreshbooksAuth(false);
    })
    .catch((error) => {
      console.log('Check auth error');
    });
  }

  useEffect(() => {
    if(freshbooksAuthorized) {
      freshbooks_api_client.get('/auth/api/v1/users/me')
      .then((response) => {
        // Assume first business
        return response.data.response.business_memberships[0].business.id;
      })
      .then((businessId) => {
        return freshbooks_api_client.get(`timetracking/business/${businessId}/time_entries?started_from=${moment().startOf('week')}`);
      })
      .then((response) => {
        setCurrentWeeklyBillableHours(response.data.meta.total_logged / 60 / 60);
        setLoadingCurrentWeeklyBillableHours(false);
      })
      .catch((error) => {
        console.log(`ERROR: ${error}`);
      });
    }
  }, [freshbooksAuthorized]);

  useEffect(() => {
    checkFreshbooksAuth();
  }, []);

  const weeklyBillableHoursTarget = 20;
  const percentage = currentWeeklyBillableHours / weeklyBillableHoursTarget * 100.00;

  return (
    <Card style={styles.card} appearance='outline'>
      {
        checkingFreshbooksAuth ?
          <View style={styles.progressCircleSpinnerContainer}>
            <Spinner size='giant' />
          </View>
        :
          !freshbooksAuthorized ?
            <View style={styles.placeHolderProgressCircle}></View>
          :
            loadingCurrentWeeklyBillableHours ?
              <View style={styles.progressCircleSpinnerContainer}>
                <Spinner size='giant' />
              </View>
            :
              <StyledProgressCircle percentage={percentage} text={`${numeral(currentWeeklyBillableHours).format('0.0')}/${weeklyBillableHoursTarget}`} />
      }
      <Text style={styles.bhtCaption}>WBHT</Text>
      {
        checkingFreshbooksAuth ?
          <View style={styles.checkingFreshbooksAuthSpinnerContainer}>
            <Spinner />
          </View>
        :
          !freshbooksAuthorized &&
          <Button onPress={authorizeFreshbooks}>
            {
              launchingFreshbooksLogin ? 'Please wait...' : 'Authorize FreshBooks'
            }
          </Button>
      }
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    alignItems: 'center',
  },
  bhtCaption: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: 10,
    fontWeight: 'bold',
  },
  progressCircleSpinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: 200,
  },
  checkingFreshbooksAuthSpinnerContainer: {
    alignItems: 'center',
    width: 200,
  },
  placeHolderProgressCircle: {
    backgroundColor: '#eeeeee',
    width: 200,
    height: 200,
    borderRadius: 200,
  }
});

export default WeeklyBillableHoursProgress;