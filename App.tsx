import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import * as eva from '@eva-design/eva';
import * as Notifications from 'expo-notifications';
import { ApplicationProvider, IconRegistry, Button } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { default as biteSiteTheme } from './src/themes/bitesite-theme.json';

import SignedInContextProvider from './src/contexts/SignedInContextProvider';

import AuthorizationSwitcher from './src/navigation/AuthorizationSwitcher';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export default function App() {

  const [notification, setNotification] = useState();
  const [showNotification, setShowNotification] = useState(false);

  function handleForegroundNotification(notificationObject) {
    setNotification(notificationObject.request.content);
    setShowNotification(true);
  }

  function handleNotificationResponse() {

  }

  useEffect(() => {
    Notifications.addNotificationReceivedListener(handleForegroundNotification);
    Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
  });

  useEffect(() => {
    if(showNotification) {
      setTimeout(() => {
        setShowNotification(false);
      }, 10000);
    }
  }, [showNotification]);

  return (
    <NavigationContainer>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{...eva.light, ...biteSiteTheme}}>
        <SignedInContextProvider>
          {
            showNotification && notification &&
            <View style={styles.notificationArea}>
              <SafeAreaView>
                <View style={styles.notificationCard}>
                  <View style={styles.notificationText}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationBody}>{notification.body}</Text>
                  </View>
                  <View style={styles.notificationActions}>
                    <Button
                      appearance='ghost'
                      onPress={() => setShowNotification(false)}
                    >
                      Dimiss
                    </Button>
                  </View>
                </View>
              </SafeAreaView>
            </View>
          }
          <AuthorizationSwitcher />
        </SignedInContextProvider>
      </ApplicationProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  notificationArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 10,
    padding: 10,
  },
  notificationCard: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    shadowOffset: { width: 2, height: 2},
    shadowColor: 'black',
    shadowOpacity: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationText: {

  },
  notificationActions: {

  },
  notificationTitle: {
    fontWeight: 'bold',
  },
  notificationBody: {

  },


});
