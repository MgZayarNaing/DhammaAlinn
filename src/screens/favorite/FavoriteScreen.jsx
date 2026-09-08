import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/components/ScreenHeader';
import { COLORS } from '@theme/colors';
import BookItem from '@/components/BookItem';
import AudioItem from '@/components/AudioItem';
import { useFavorites } from '@/context/favorites/FavoritesContext';
import { BOOKS } from '@/screens/home/BookData';
import { AUDIO_DATA } from '@/screens/audio/AudioData';

const FavoriteScreen = () => {
  const [currentTab, setCurrentTab] = useState('books');
  const {
    hydrated,
    favoriteBookIds,
    favoriteAudioIds,
    toggleBook,
    toggleAudio,
  } = useFavorites();

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const savedBooks = BOOKS.filter((book) => favoriteBookIds.has(book.id));
  const savedAudios = AUDIO_DATA.filter((audio) => favoriteAudioIds.has(audio.id));

  const renderItem = ({ item }) => {
    if (currentTab === 'books') {
      return <BookItem book={item} onToggleSave={() => toggleBook(item.id)} />;
    } else {
      return <AudioItem audio={item} onToggleSave={() => toggleAudio(item.id)} />;
    }
  };

  return (
    <SafeAreaView style={styles.statusBarWrapper} edges={['top']}>
      <ScreenHeader />
      <View style={styles.container}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              currentTab === 'books' ? styles.activeTab : null,
            ]}
            onPress={() => handleTabChange('books')}
          >
            <Text style={styles.tabText}>Saved Books</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              currentTab === 'audios' ? styles.activeTab : null,
            ]}
            onPress={() => handleTabChange('audios')}
          >
            <Text style={styles.tabText}>Downloaded Audios</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={currentTab === 'books' ? savedBooks : savedAudios}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            hydrated ? (
              <Text style={styles.emptyText}>
                {currentTab === 'books' ? 'No favorite books yet.' : 'No favorite audios yet.'}
              </Text>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  statusBarWrapper: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex:1,
    backgroundColor: COLORS.container,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.primary
    
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.secondary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textColor,
  },
  list: {
    padding: 16,
    flexGrow: 1
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: COLORS.dark,
  },
});

export default FavoriteScreen;
