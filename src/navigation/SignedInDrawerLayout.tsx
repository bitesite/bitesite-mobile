import React, { useState, useContext } from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';

import DashboardScreen from '../screens/DashboardScreen';
import NewsScreen from '../screens/NewsScreen';
import VacationStackNavigator from '../navigation/VacationStackNavigator';
import AccountScreen from '../screens/AccountScreen';

import { SafeAreaView } from 'react-native';
import { Drawer, DrawerItem, IndexPath } from '@ui-kitten/components';

import UpdateSignedInContext from '../contexts/UpdateSignedInContext';
import { SignedInDrawerParamList } from '../utilities/types_and_interfaces';

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
          updateSignedIn(false);
          return;
        }
      }
    }

    return (
      <Drawer onSelect={handleDrawerSelect} selectedIndex={selectedDrawerIndex}>
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