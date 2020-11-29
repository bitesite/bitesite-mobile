import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignedInContext from './SignedInContext';
import UpdateSignedInContext from './UpdateSignedInContext';
import api_client from '../utilities/api_client';

export default function SignedInContextProvider({ children }) {
  const [signedIn, setSignedIn] = useState(false);

  function updateSignedIn(value: boolean) {
    if(!value) {
      api_client.defaults.headers.common['Authorization'] = '';
      AsyncStorage.removeItem("@auth_token").then(() => {
        setSignedIn(value);
      })
    } else {
      setSignedIn(value);
    }
  }

  return (
    <SignedInContext.Provider value={signedIn}>
      <UpdateSignedInContext.Provider value={updateSignedIn}>
        {children}
      </UpdateSignedInContext.Provider>
    </SignedInContext.Provider>
  );
}