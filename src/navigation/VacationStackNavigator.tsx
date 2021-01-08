import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VacationMainScreen from '../screens/VacationMainScreen';
import VacationFormScreen from '../screens/VacationFormScreen';
import { VacationStackParamList } from '../utilities/types_and_interfaces';

const Stack = createStackNavigator<VacationStackParamList>();

export default function VacationStackNavigator() {
  return (
    <Stack.Navigator 
      mode='modal'
      initialRouteName='VacationMain'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='VacationMain' component={VacationMainScreen} />
      <Stack.Screen name='VacationForm' component={VacationFormScreen} />
    </Stack.Navigator>
  );
}