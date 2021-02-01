import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, Layout, Button, Input } from '@ui-kitten/components';
import api_client from '../utilities/api_client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UpdateSignedInContext from '../contexts/UpdateSignedInContext';
import { SigninScreenProps } from '../utilities/types_and_interfaces';

import LottieView from 'lottie-react-native';

export default function SignInScreen(props: SigninScreenProps) {  
  let animation;
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
      console.log('sign in failed');
    });
  }

  useEffect(() => {
    animation.play();
  }, []);

  return (
    <Layout style={styles.layout}>
      <LottieView
        ref={(animationRef) => {
          animation = animationRef;
        }}
        style={{
          width: 200,
          height: 200,
        }}
        source={require('../../assets/lf30_editor_s1i0him3.json')}
      />
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
    marginTop: 20,
    alignItems: 'flex-start',
  },
  slogan: {
    marginBottom: 5,
  },
  subslogan: {
    marginBottom: 10,
  }
});