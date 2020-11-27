import React, { useState } from 'react';
import { Text, Layout, Button, Input } from '@ui-kitten/components';
import api_client from '../utilities/api_client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignInScreen({ onSignIn }) {
  const [email, setEmail]: [email: string, setEmail: any] = useState('');
  const [password, setPassword]: [password: string, setPassword: any] = useState('');

  function submitForm() {
    console.log(email);
    api_client.post(
      'sessions', 
      { 
        session: { email, password }
      }
    )
    .then((response) => {
      console.log('success');
      const authToken = response.data.auth_token;
      AsyncStorage.setItem('@auth_token', authToken).then(() => {
        onSignIn();
        console.log('stored');
      });
    })
    .catch((error) => {
      // TODO: Not signed in
      console.log('failed');
    });
  }

  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text category='h1'>Sign in</Text>
      <Input placeholder='Email' onChangeText={(value) => setEmail(value)} />
      <Input placeholder='Password' secureTextEntry={true} onChangeText={(value) => setPassword(value)} />
      <Button onPress={submitForm}>Sign in</Button>
    </Layout>
  );
}