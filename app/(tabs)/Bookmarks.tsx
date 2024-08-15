import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getBookmarks, addBookmark, removeBookmark } from './BookmarkHelper';

// Define JobItem type directly in this file
interface JobItem {
  id: number;
  title?: string;
  whatsapp_no?: string;
  primary_details?: {
    Place?: string;
    Salary?: string;
    Job_Type?: string;
  };
  description?: string;
}

const TabTwoScreen = () => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = useCallback(async () => {
    try {
      const jobs = await getBookmarks();
      setBookmarkedJobs(jobs);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  useEffect(() => {
    const interval = setInterval(loadBookmarks, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [loadBookmarks]);

  const removeFromBookmarks = async (id: number) => {
    try {
      await removeBookmark(id);
      setBookmarkedJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const renderItem = ({ item }: { item: JobItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.jobInfo}>
        <Text style={styles.title}>{item.title || 'No Title'}</Text>
        <Text style={styles.text}>{item.primary_details?.Place || 'No Location'}</Text>
        <Text style={styles.text}>{item.primary_details?.Salary || 'No Salary'}</Text>
        <Text style={styles.text}>{item.whatsapp_no || 'No Number'}</Text>
        <Text style={styles.text}>{item.description || 'No Description'}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromBookmarks(item.id)}>
        <Icon name="remove-circle" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Bookmarked Jobs</Text>
      <FlatList
        data={bookmarkedJobs}
        renderItem={renderItem}
        keyExtractor={item => item.id ? item.id.toString() : 'no-id'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#000',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    padding: 20,
    backgroundColor: '#333',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  jobInfo: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  text:{
    color: '#ddd',
  }
});

export default TabTwoScreen;
