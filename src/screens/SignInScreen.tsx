import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Text, Layout, Button, Input, Spinner } from '@ui-kitten/components';
import api_client from '../utilities/api_client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UpdateSignedInContext from '../contexts/UpdateSignedInContext';
import { SigninScreenProps } from '../utilities/types_and_interfaces';

import LottieView from 'lottie-react-native';

export default function SignInScreen(props: SigninScreenProps) {  
  let animation: LottieView | null;
  const [email, setEmail]: [email: string, setEmail: any] = useState('');
  const [password, setPassword]: [password: string, setPassword: any] = useState('');
  const [signingIn, setSigningIn]: [signingIn: boolean, setSigningIn: any] = useState(false);
  const updateSignedIn = useContext(UpdateSignedInContext);

  function submitForm() {
    setSigningIn(true);
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
      setSigningIn(false);
      Alert.alert('Sign in failed.');
    });
  }

  useEffect(() => {
    if(animation) {
      animation.play();
    }
  }, []);

  return (
    <Layout style={styles.layout}>
      <View style={styles.animationContainer}>
        <LottieView
          ref={(animationRef) => {
            animation = animationRef;
          }}
          style={{
            width: 200,
            height: 200,
          }}
          source={require('../../assets/34526-coding-in-office.json')}
        />
      </View>
      <View style={styles.form}>
        <Text style={styles.slogan} category='h1'>Welcome</Text>
        <Text style={styles.subslogan}>Let's get started</Text>
        <Input 
          placeholder='Email'
          size='large'
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(value) => setEmail(value)}
        />
        <Input 
          placeholder='Password'
          size='large'
          secureTextEntry={true}
          onChangeText={(value) => setPassword(value)} 
        />
        <Button onPress={submitForm}>
          {
            signingIn ?
              <Spinner status='basic' size='small' />
            :
              'Sign in'
          }
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  layout: { 
    flex: 1, 
    paddingHorizontal: 16,
    marginTop: 20,
    alignItems: 'stretch',
  },
  animationContainer: {
    marginTop: 80,
    alignItems: 'flex-end',
  },
  form: {
    alignItems: 'flex-start',
  },
  slogan: {
    marginBottom: 5,
  },
  subslogan: {
    marginBottom: 10,
  },
});