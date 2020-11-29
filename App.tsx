import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { default as biteSiteTheme } from './src/themes/bitesite-theme.json';

import SignedInContextProvider from './src/contexts/SignedInContextProvider';

import AuthorizationSwitcher from './src/navigation/AuthorizationSwitcher';

export default function App() {
  return (
    <NavigationContainer>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{...eva.light, ...biteSiteTheme}}>
        <SignedInContextProvider>
          <AuthorizationSwitcher />
        </SignedInContextProvider>
      </ApplicationProvider>
    </NavigationContainer>
  );
}
