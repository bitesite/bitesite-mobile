import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon, Button } from '@ui-kitten/components';

export default function ScreenHeader({ navigation, title }) {
  function handleMenuPress() {
    navigation.toggleDrawer();
  }

  function menuIcon(props){
    return <Icon name='menu-outline' style={styles.icon} {...props} />;
  }

  return (
    <View style={styles.screenHeader}>
      <Button 
        style={styles.menuButton} 
        onPress={handleMenuPress}
        appearance='ghost'
        accessoryLeft={menuIcon} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
  },
  title: {
    fontWeight: '800',
    fontSize: 32,
  },
  menuButton: {
    // width: 100,
  },
  icon: {
    height: 50,
    width: 50,
  }
});