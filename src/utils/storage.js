import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_BOOKS_KEY = 'savedBooks';
const SAVED_AUDIOS_KEY = 'savedAudios';

const safeParseArray = (value) => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const getSavedBooks = async () => {
  const savedBooks = await AsyncStorage.getItem(SAVED_BOOKS_KEY);
  return safeParseArray(savedBooks);
};

const getSavedAudios = async () => {
  const savedAudios = await AsyncStorage.getItem(SAVED_AUDIOS_KEY);
  return safeParseArray(savedAudios);
};

const saveBooks = async (bookIds) => {
  await AsyncStorage.setItem(SAVED_BOOKS_KEY, JSON.stringify(bookIds));
};

const saveAudios = async (audioIds) => {
  await AsyncStorage.setItem(SAVED_AUDIOS_KEY, JSON.stringify(audioIds));
};

export {
  getSavedBooks,
  getSavedAudios,
  saveBooks,
  saveAudios,
};
