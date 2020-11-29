import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Layout, Card, List, Text } from '@ui-kitten/components';
import ScreenHeader from '../components/ScreenHeader';
import apiClient from '../utilities/api_client';

export default function SettingsScreen({ navigation }) {

  const [newsPosts, setNewsPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const pageSize = 20;

  function loadNewsPosts() {
    apiClient.get(`/news_posts?limit=${pageSize}&offset=${offset}`)
    .then((response) => {
      setNewsPosts([...newsPosts, ...response.data]);
    })
  }
  
  function renderNewsItem({ item: newsPost }) {
    const header = (props) => {
      return (
        <View {...props}>
          <Text category='h6'>{newsPost.title}</Text>
        </View>
      );
    }

    return (
      <Card style={styles.newsPostCard} header={header}>
        <Text appearance='hint'>{newsPost.body}</Text>
      </Card>
    );
  }

  function handleListEndReached() {
    setOffset(offset + pageSize);
  }

  useEffect(loadNewsPosts, [offset]);
  useEffect(loadNewsPosts, []);


  return (
    <Layout>
      <SafeAreaView>
        <ScreenHeader title='News' navigation={navigation} />
        <List
          style={styles.newsPostsList}
          data={newsPosts}
          renderItem={renderNewsItem}
          onEndReached={handleListEndReached}
          onEndReachedThreshold={1}
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