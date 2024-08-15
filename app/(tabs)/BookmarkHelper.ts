import AsyncStorage from '@react-native-async-storage/async-storage';

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

const BOOKMARKS_KEY = 'bookmarked_jobs';

export const getBookmarks = async (): Promise<JobItem[]> => {
  try {
    const storedBookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return storedBookmarks ? JSON.parse(storedBookmarks) : [];
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
};

export const addBookmark = async (job: JobItem): Promise<void> => {
  try {
    const bookmarks = await getBookmarks();
    const updatedBookmarks = [...bookmarks, job];
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
  } catch (error) {
    console.error('Error adding bookmark:', error);
  }
};

export const removeBookmark = async (id: number): Promise<void> => {
  try {
    const bookmarks = await getBookmarks();
    const updatedBookmarks = bookmarks.filter(job => job.id !== id);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
  } catch (error) {
    console.error('Error removing bookmark:', error);
  }
};
