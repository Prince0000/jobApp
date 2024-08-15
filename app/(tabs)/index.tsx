import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Platform, Modal, Pressable, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { addBookmark, removeBookmark, getBookmarks } from './BookmarkHelper';

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

const HomeScreen = () => {
  const [data, setData] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<number>>(new Set());
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
    loadBookmarks();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
      const result = await response.json();
      if (Array.isArray(result.results)) {
        setData(prevData => [...prevData, ...result.results]);
        setHasMore(result.results.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setError('Error fetching jobs');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const bookmarks = await getBookmarks();
      setBookmarkedJobs(new Set(bookmarks.map(job => job.id)));
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const toggleBookmark = async (job: JobItem) => {
    try {
      if (bookmarkedJobs.has(job.id)) {
        await removeBookmark(job.id);
        setBookmarkedJobs(prev => {
          const updated = new Set(prev);
          updated.delete(job.id);
          return updated;
        });
      } else {
        await addBookmark(job);
        setBookmarkedJobs(prev => new Set(prev).add(job.id));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handlePress = (item: JobItem) => {
    setSelectedJob(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  const renderItem = ({ item }: { item: JobItem }) => {
    const isBookmarked = bookmarkedJobs.has(item.id);

    return (
      <View style={styles.itemContainer} key={item.id}>
        <TouchableOpacity style={styles.cardContent} onPress={() => handlePress(item)}>
          <View style={styles.jobInfo}>
            <Text style={styles.title}>{item.title || 'No Title'}</Text>
            <Text style={styles.text}>{item.primary_details?.Place || 'No Location'}</Text>
            <Text style={styles.text}>{item.primary_details?.Salary || 'No Salary'}</Text>
            <Text style={styles.text}>{item.whatsapp_no || 'No Number'}</Text>
            <Text style={styles.text}>{item.description || 'No Description'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkButton} onPress={() => toggleBookmark(item)}>
          <Icon name={isBookmarked ? 'bookmark' : 'bookmark-border'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  const keyExtractor = (item: JobItem) => item.id ? item.id.toString() : 'no-id';

  if (loading && page === 1) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Job Listings</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={() => {
          if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && hasMore ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : null
        }
      />
      {selectedJob && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedJob.title || 'No Title'}</Text>
                <Text style={styles.modalText}>Location: {selectedJob.primary_details?.Place || 'No Location'}</Text>
                <Text style={styles.modalText}>Salary: {selectedJob.primary_details?.Salary || 'No Salary'}</Text>
                <Text style={styles.modalText}>Number: {selectedJob.whatsapp_no || 'No Number'}</Text>
                <Text style={styles.modalText}>Description: {selectedJob.description || 'No Description'}</Text>
              </ScrollView>
              <Pressable onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#121212',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    padding: 20,
    backgroundColor: '#1F1F1F',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
  },
  jobInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  text: {
    color: '#ccc',
  },
  bookmarkButton: {
    marginLeft: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  error: {
    color: '#f00',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E1E1E',
    padding: 20,
    justifyContent: 'center',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalText: {
    color: '#ccc',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
