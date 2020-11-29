import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';

export default function TimeOffEntriesFormScreen({ navigation }) {

  function handleSubmitPress() {

  }

  function handleCancelPress() {
    navigation.goBack();
  }

  return (
    <Layout>
      <SafeAreaView>
        <Text>Book time off</Text>
        <View style={styles.actions}> 
          <Button 
            color='primary'
            onPress={handleSubmitPress}
          >
            Submit
          </Button>
          <Button 
            appearance='ghost'
            onPress={handleCancelPress}
          >
            Cancel
          </Button>
        </View>
      </SafeAreaView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
  }
});