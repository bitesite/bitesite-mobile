import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VacationMainScreen from '../screens/VacationMainScreen';
import VacationFormScreen from '../screens/VacationFormScreen';

const Stack = createStackNavigator();

export default function VacationNavigator() {
  return (
    <Stack.Navigator 
      mode='modal'
      initialRouteName='Vacation'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='VacationMain' component={VacationMainScreen} />
      <Stack.Screen name='VacationForm' component={VacationFormScreen} />
    </Stack.Navigator>
  );
}