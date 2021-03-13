import React, { useState, useContext, useEffect } from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';

import DashboardScreen from '../screens/DashboardScreen';
import NewsScreen from '../screens/NewsScreen';
import VacationStackNavigator from '../navigation/VacationStackNavigator';
import AccountScreen from '../screens/AccountScreen';

import { SafeAreaView, Platform, View, StyleSheet } from 'react-native';
import { Divider, Drawer, DrawerItem, IndexPath, Text, useTheme } from '@ui-kitten/components';

import UpdateSignedInContext from '../contexts/UpdateSignedInContext';
import { SignedInDrawerParamList } from '../utilities/types_and_interfaces';

import apiClient from '../utilities/api_client';

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import environment from '../utilities/environment';

const DrawerNavigator = createDrawerNavigator<SignedInDrawerParamList>();

export default function SignedInDrawerLayout() {
  
  const updateSignedIn = useContext(UpdateSignedInContext);

  const DrawerContent = ({ navigation }) => {

    const [selectedDrawerIndex, setSelectedDrawerIndex] = useState<IndexPath>(new IndexPath(0));

    function handleDrawerSelect(index: IndexPath) {
      navigation.toggleDrawer();
      setSelectedDrawerIndex(index);

      switch (index.row) {
        case 0: {
          navigation.navigate('Dashboard');
          return;
        }
        case 1: {
          navigation.navigate('News');
          return;
        }
        case 2: {
          navigation.navigate('Vacation');
          return;
        }
        case 3: {
          navigation.navigate('Account');
          return;
        }
        case 4: {

          Permissions.getAsync(Permissions.NOTIFICATIONS)
          .then((response) => {
            const { status } = response;
            if(status === 'granted') {
              return Notifications.getExpoPushTokenAsync();
            } else {
              return;
            }
          })
          .then((expoPushTokenResponse) => {
            if(expoPushTokenResponse) {
              const expoPushToken = expoPushTokenResponse.data;
              return apiClient.put('/account/register_device', {
                device: {
                  push_token: expoPushToken,
                  signed_in: false,
                }
              });
            } else {
              return;
            }
          })
          .then(() => {
            updateSignedIn(false);
          });
        }
      }
    }

    const DrawerFooter = () => {
      const theme = useTheme();
      return (
        <>
          <Divider />
          <View style={styles.drawerFooterView}>
            <Text category='label' style={{color: theme['color-primary-300']}}>{environment.name}</Text>
          </View>
        </>
      );
    }

    return (
      <Drawer
        onSelect={handleDrawerSelect}
        selectedIndex={selectedDrawerIndex}
        footer={DrawerFooter}
      >
        <SafeAreaView>
          <DrawerItem title='Dashboard' />
          <DrawerItem title='News' />
          <DrawerItem title='Vacation' />
          <DrawerItem title='Account' />
          <DrawerItem title='Sign out' />
        </SafeAreaView>
      </Drawer>
    );
  }

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      return token;
    } else {
      console.info('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((expoPushToken) => {
      apiClient.put('/account/register_device', {
        device: {
          push_token: expoPushToken,
          os: Platform.OS,
          os_version: Platform.Version,
          signed_in: true,
        }
      });
    });
  }, []);

  return (
    <DrawerNavigator.Navigator 
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName="Dashboard">
      <DrawerNavigator.Screen name="Dashboard" component={DashboardScreen} />
      <DrawerNavigator.Screen name="News" component={NewsScreen} />
      <DrawerNavigator.Screen name="Vacation" component={VacationStackNavigator} />
      <DrawerNavigator.Screen name="Account" component={AccountScreen} />
    </DrawerNavigator.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerFooterView: {
    padding: 10,
  },
});