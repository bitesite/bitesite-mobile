import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Layout, Card, List, Text } from '@ui-kitten/components';
import ScreenHeader from '../components/ScreenHeader';
import apiClient from '../utilities/api_client';

export default function SettingsScreen({ navigation }) {

  const [newsPosts, setNewsPosts] = useState([]);

  function loadNewsPosts() {
    apiClient.get('/news_posts')
    .then((newsPosts) => {
      setNewsPosts(newsPosts.data);
    })
  }
  
  function renderNewsItem({ item, index }) {
    const newsItem = item;

    const header = (props) => {
      return (
        <View {...props}>
          <Text category='h6'>{newsItem.title}</Text>
        </View>
      );
    }

    return (
      <Card style={styles.newsPostCard} header={header}>
        <Text appearance='hint'>{newsItem.body}</Text>
      </Card>
    );
  }

  useEffect(loadNewsPosts, []);


  return (
    <Layout>
      <SafeAreaView>
        <ScreenHeader title='News' navigation={navigation} />
        <List
          style={styles.newsPostsList}
          data={newsPosts}
          renderItem={renderNewsItem}
        />
      </SafeAreaView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  newsPostsList: {
  },
  newsPostCard: {
    marginTop: 10,
    marginHorizontal: 10,
  }
});