import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, Spinner, Text, useTheme } from '@ui-kitten/components';
import freshbooks_api_client from '../utilities/freshbooks_api_client';
import numeral from 'numeral';
import moment from 'moment';
import StyledProgressCircle from './StyledProgressCircle';
import PlaceholderProgressCircle from './PlaceholderProgressCircle';
import apiClient from '../utilities/api_client';
import { Ionicons } from '@expo/vector-icons';

function WeeklyBillableHoursProgress() {
  
  const theme = useTheme();

  const [checkingFreshbooksAuth, setCheckingFreshbooksAuth] = useState(false);
  const [launchingFreshbooksLogin, setLaunchingFreshbooksLogin] = useState(false);
  const [freshbooksAuthorized, setFreshbooksAuthorized] = useState(false);
  const [loadingCurrentWeeklyBillableHours, setLoadingCurrentWeeklyBillableHours] = useState(true);
  const [currentWeeklyBillableHours, setCurrentWeeklyBillableHours] = useState(0);
  const [weeklyBillableHoursTarget, setWeeklyBillableHoursTarget] = useState();

  function authorizeFreshbooks() {
    setLaunchingFreshbooksLogin(true);
    freshbooks_api_client.authorize()
    .then(() => {
      checkFreshbooksAuth();
      setLaunchingFreshbooksLogin(false);
    })
    .catch(() => {
      setLaunchingFreshbooksLogin(false);
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

  function loadWeeklyBillableHoursTarget() {

    apiClient.get('/profile').then((response) => {
      if(isNaN(response.data.weekly_billable_hours_target)) {

      } else {
        setWeeklyBillableHoursTarget(response.data.weekly_billable_hours_target);
      }
    })
    .catch((error) => {
      console.log("Could not fetch profile.");
      console.log(error);
    });
  }

  function loadCurrentWeeklyBillableHours() {
    setLoadingCurrentWeeklyBillableHours(true);
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

  useEffect(() => {
    if(freshbooksAuthorized) {
      loadCurrentWeeklyBillableHours();
    }
  }, [freshbooksAuthorized]);

  useEffect(() => {
    checkFreshbooksAuth();
    loadWeeklyBillableHoursTarget();
  }, []);

  const percentage = currentWeeklyBillableHours / weeklyBillableHoursTarget * 100.00;

  return (
    <View style={styles.main}>
      {
        checkingFreshbooksAuth ?
          <View style={styles.progressCircleSpinnerContainer}>
            <Spinner size='giant' />
          </View>
        :
          !freshbooksAuthorized ?
            <PlaceholderProgressCircle text={'Authorize Freshbooks'} />
          :
            !weeklyBillableHoursTarget ?
              <PlaceholderProgressCircle text={'Please set Target'} />
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

      <View style={styles.refreshContainer}>
        <TouchableOpacity style={styles.refreshButton} onPress={loadCurrentWeeklyBillableHours}>
          <Ionicons name="refresh-outline" size={24} color="#aaaaaa" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    margin: 10,
    alignItems: 'center',
    paddingVertical: 10,
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
  refreshContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default WeeklyBillableHoursProgress;