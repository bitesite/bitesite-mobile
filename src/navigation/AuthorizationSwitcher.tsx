import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Spinner } from '@ui-kitten/components';

import api_client from '../utilities/api_client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UpdateSignedInContext from '../contexts/UpdateSignedInContext';
import SignedInContext from '../contexts/SignedInContext';

import SignInScreen from '../screens/SignInScreen';
import SignedInDrawerLayout from './SignedInDrawerLayout';
import { SignedOutStackParamList } from '../utilities/types_and_interfaces';

import * as Linking from 'expo-linking';

export default function AuthorizationSwitcher() {
  const [checkingStatus, setCheckingStatus] = useState(true);
  const updateSignedIn = useContext(UpdateSignedInContext);
  const signedIn = useContext(SignedInContext);

  console.log(Linking.makeUrl('/auth/redirect'));
  Linking.addEventListener('url', (event) => {
    console.log('Received');
    console.log(event.url);
  });

  function checkSignIn() {
    AsyncStorage.getItem('@auth_token')
    .then((authToken) => {
      if(authToken !== null) {
        api_client.defaults.headers.common['Authorization'] = authToken;
        return api_client.get('sessions/status');
      } else {
        throw new Error('No auth token');
      }
    })
    .then(() => {
      setCheckingStatus(false);
      updateSignedIn(true);
    })
    .catch((error) => {
      console.log(error.message);
      setCheckingStatus(false);
      updateSignedIn(false);
    }) 
  }

  useEffect(() => {
    checkSignIn();
  }, []);

  const SignedOutStack = createStackNavigator<SignedOutStackParamList>();

  return (
    checkingStatus ?
      <View style={styles.loadingView}>
        <Spinner />
        <Text style={styles.loadingText}>One second...</Text>
      </View>
    :
      signedIn ?
        <SignedInDrawerLayout />
      :
        <SignedOutStack.Navigator>
          <SignedOutStack.Screen name='Signin' component={SignInScreen} options={{headerShown: false}}/>
        </SignedOutStack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 20,
  },
});