import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import ProgressCircle from 'react-native-progress-circle'
import { Button, Card, Spinner, Text, useTheme } from '@ui-kitten/components';
import * as AppAuth from 'expo-app-auth';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import freshbooks_api_client from '../utilities/freshbooks_api_client';

function WeeklyBillableHoursProgress() {
  let animation: LottieView | null;
  const theme = useTheme();

  const [checkingFreshbooksAuth, setCheckingFreshbooksAuth] = useState(true);
  const [freshbooksAuthCredentials, setFreshbooksAuthCredentials] = useState(true);

  const currentWeeklyBillableHours = 19;
  const weeklyBillableHoursTarget = 24;
  const percentage = currentWeeklyBillableHours / weeklyBillableHoursTarget * 100.00;

  function authorizeFreshbooks() {
    const redirectUri = Linking.makeUrl('/auth/redirect');

    const config = {
      serviceConfiguration: {
        authorizationEndpoint: `https://auth.freshbooks.com/service/auth/oauth/authorize?client_id=FILL_IN&response_type=code`,
        tokenEndpoint: 'https://api.freshbooks.com/auth/oauth/token'
      },
      redirectUrl: redirectUri,
      clientId: 'FILL IN',
      clientSecret: 'FILL IN',
      scopes: [],
    };

    AppAuth.authAsync(config)
    .then((authState) => {
      AsyncStorage.setItem('@freshbooks_auth', JSON.stringify(authState)).then(() => {
        console.log("Freshbooks auth stored!");
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  function checkFreshbooksAuth() {
    AsyncStorage.getItem('@freshbooks_auth')
    .then((data) => {
      if(data) {
        setFreshbooksAuthCredentials(JSON.parse(data));
      }
      setCheckingFreshbooksAuth(false);
    })
    .catch(() => {
      setCheckingFreshbooksAuth(false);
    });
  }

  useEffect(() => {
    if(freshbooksAuthCredentials) {
      freshbooks_api_client.get('/test').then((response) => {
        console.log(response.data);
      });
    }
  }, [freshbooksAuthCredentials]);

  useEffect(checkFreshbooksAuth, []);
  useEffect(() => {
    if(animation) {
      animation.play();
    }
  }, []);

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
            <Text style={styles.progressText}>{`${currentWeeklyBillableHours}/${weeklyBillableHoursTarget}`}</Text>
        }
      </ProgressCircle>
      <Text style={styles.bhtCaption}>WBHT</Text>
      {
        checkingFreshbooksAuth ?
          <Spinner />
        :
          freshbooksAuthCredentials ?
            <Text>Freshbooks Authorized</Text>
          :
            <Button onPress={authorizeFreshbooks}>Authorize FreshBooks</Button>
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