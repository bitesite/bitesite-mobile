import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import ProgressCircle from 'react-native-progress-circle'
import { Button, Card, Spinner, Text, useTheme } from '@ui-kitten/components';
import freshbooks_api_client from '../utilities/freshbooks_api_client';
import numeral from 'numeral';

function WeeklyBillableHoursProgress() {
  let animation: LottieView | null;
  const theme = useTheme();

  const [checkingFreshbooksAuth, setCheckingFreshbooksAuth] = useState(false);
  const [launchingFreshbooksLogin, setLaunchingFreshbooksLogin] = useState(false);
  const [freshbooksAuthorized, setFreshbooksAuthorized] = useState(false);
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
    freshbooks_api_client.checkAuthorization()
    .then(() => {
      setFreshbooksAuthorized(freshbooks_api_client.authorized);
      setCheckingFreshbooksAuth(false);
    })
    .catch(() => {
      console.log('Check auth error');
    });
  }

  useEffect(() => {
    if(freshbooksAuthorized) {
      freshbooks_api_client.get('/auth/api/v1/users/me')
      .then((response) => {
        return response.data.response.business_memberships[0].business.id;
      })
      .then((businessId) => {
        return freshbooks_api_client.get(`timetracking/business/${businessId}/time_entries?started_from=2021-02-15T04%3A00%3A00Z`);
      })
      .then((response) => {
        setCurrentWeeklyBillableHours(response.data.meta.total_logged / 60 / 60);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [freshbooksAuthorized]);

  useEffect(() => {
    checkFreshbooksAuth();
  }, []);

  useEffect(() => {
    if(animation) {
      animation.play();
    }
  }, []);


  const weeklyBillableHoursTarget = 24;
  const percentage = currentWeeklyBillableHours / weeklyBillableHoursTarget * 100.00;

  return (
    <Card style={styles.card} appearance='outline'>
      <ProgressCircle
          percent={percentage}
          radius={100}
          borderWidth={12}
          color={theme['color-primary-300']}
          shadowColor={theme['color-primary-900']}
          bgColor={theme['color-primary-900']}
      >
        {
          percentage >= 100 ?
            <LottieView
              ref={(animationRef) => {
                animation = animationRef;
              }}
              style={{
                width: 200,
                height: 200,
              }}
              source={require('../../assets/9651-winner.json')}
            />

          :
            <Text style={styles.progressText}>
              {`${numeral(currentWeeklyBillableHours).format('0.0')}/${weeklyBillableHoursTarget}`}
            </Text>
        }
      </ProgressCircle>
      <Text style={styles.bhtCaption}>WBHT</Text>
      {
        checkingFreshbooksAuth ?
          <Spinner />
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
  progressText: {
    fontSize: 32,
    color: 'white',
  }
});

export default WeeklyBillableHoursProgress;