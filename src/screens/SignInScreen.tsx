import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, Layout, Button, Input } from '@ui-kitten/components';
import api_client from '../utilities/api_client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UpdateSignedInContext from '../contexts/UpdateSignedInContext';

export default function SignInScreen({ onSignIn }) {
  const [email, setEmail]: [email: string, setEmail: any] = useState('');
  const [password, setPassword]: [password: string, setPassword: any] = useState('');

  const updateSignedIn = useContext(UpdateSignedInContext);

  function submitForm() {
    api_client.post(
      'sessions', 
      { 
        session: { email, password }
      }
    )
    .then((response) => {
      const authToken = response.data.auth_token;
      AsyncStorage.setItem('@auth_token', authToken).then(() => {
        api_client.defaults.headers.common['Authorization'] = authToken;
        updateSignedIn(true);
      });
    })
    .catch((error) => {
      // TODO: Not signed in
      console.log('failed');
    });
  }

  return (
    <Layout style={styles.layout}>
      <Text style={styles.slogan} category='h1'>Welcome</Text>
      <Text style={styles.subslogan}>Let's get started</Text>
      <Input 
        placeholder='Email'
        size='large'
        autoCapitalize='none'
        onChangeText={(value) => setEmail(value)}
      />
      <Input 
        placeholder='Password'
        size='large'
        secureTextEntry={true}
        onChangeText={(value) => setPassword(value)} 
      />
      <Button onPress={submitForm}>Sign in</Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  layout: { 
    flex: 1, 
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    justifyContent: 'center' 
  },
  slogan: {
    marginBottom: 5,
  },
  subslogan: {
    marginBottom: 10,
  }
});