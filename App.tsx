import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { default as biteSiteTheme } from './src/themes/bitesite-theme.json';

import SignInScreen from './src/screens/SignInScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SettingsScreen from './src/screens/SettingsScreen';

import api_client from './src/utilities/api_client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

export default function App() {
  const [ signedIn, setSignedIn ] = useState(false);
  
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
      setSignedIn(true);
    })
    .catch((error) => {
      console.log(error.message);
      api_client.defaults.headers.common['Authorization'] = '';
      setSignedIn(false);
    }) 
  }

  useEffect(() => {
    checkSignIn();
  }, []);

  const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab title='Dashboard'/>
      <BottomNavigationTab title='News'/>
      <BottomNavigationTab title='Vacation'/>
      <BottomNavigationTab title='Account'/>
    </BottomNavigation>
  );
  
  return (
    <NavigationContainer>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{...eva.light, ...biteSiteTheme}}>
        {
          signedIn ?
            <BottomTab.Navigator tabBar={props => <BottomTabBar {...props} />}>
              <BottomTab.Screen name='Dashboard' component={DashboardScreen} />
              <BottomTab.Screen name='News' component={SettingsScreen} />
              <BottomTab.Screen name='Vacation' component={SettingsScreen} />
              <BottomTab.Screen name='Settings' component={SettingsScreen} />
            </BottomTab.Navigator>
          :
            <Stack.Navigator>
              <Stack.Screen name='Signin' component={SignInScreen} options={{headerShown: false}}/>
            </Stack.Navigator>
        }
      </ApplicationProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

