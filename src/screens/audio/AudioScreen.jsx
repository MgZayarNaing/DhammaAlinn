import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Sound from 'react-native-sound';
import ScreenHeader from '@components/ScreenHeader';
import { COLORS } from '@theme/colors';
import {
  AUDIO_CATEGORIES,
  searchAudio,
} from './AudioData';
import { SafeAreaView } from 'react-native-safe-area-context';

Sound.setCategory('Playback');

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AudioScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [savedAudios, setSavedAudios] = useState(new Set());
  const [playingProgress, setPlayingProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const soundRef = useRef(null);
  const progressInterval = useRef(null);
  const progressBarWidth = useRef(0);

  const filteredAudios = searchAudio(searchQuery, selectedCategory);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.release();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Action handlers
  const handlePlayPause = (audio) => {
    if (currentPlayingId === audio.id) {
      // Pause current
      if (soundRef.current) {
        soundRef.current.pause();
      }
      setCurrentPlayingId(null);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else {
      // Stop previous if playing
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.release();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }

      // Play new audio
      const sound = new Sound(audio.audioUrl, null, (error) => {
        if (error) {
          console.log('Failed to load sound:', error);
          return;
        }
        sound.play((success) => {
          if (success) {
            setCurrentPlayingId(null);
            setPlayingProgress(0);
            setCurrentTime(0);
          }
        });
        setCurrentPlayingId(audio.id);
        setDuration(sound.getDuration());

        // Track progress
        progressInterval.current = setInterval(() => {
          sound.getCurrentTime((seconds) => {
            const dur = sound.getDuration();
            if (dur > 0) {
              setPlayingProgress(seconds / dur);
              setCurrentTime(seconds);
            }
          });
        }, 300);
      });
      soundRef.current = sound;
    }
  };

  const handleSeek = (event) => {
    if (!soundRef.current || !progressBarWidth.current) return;
    const { locationX } = event.nativeEvent;
    const seekFraction = Math.max(0, Math.min(1, locationX / progressBarWidth.current));
    const seekTime = seekFraction * duration;
    soundRef.current.setCurrentTime(seekTime);
    setPlayingProgress(seekFraction);
    setCurrentTime(seekTime);
  };

  const handleSave = (audioId) => {
    setSavedAudios((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(audioId)) {
        newSet.delete(audioId);
      } else {
        newSet.add(audioId);
      }
      return newSet;
    });
  };

  // Render components
  const renderCategoryChip = (category) => {
    const isSelected = selectedCategory === category.id;
    return (
      <TouchableOpacity
        key={category.id}
        style={[styles.chip, isSelected && styles.chipSelected]}
        onPress={() => setSelectedCategory(category.id)}
      >
        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
          {category.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAudioItem = ({ item }) => {
    const isPlaying = currentPlayingId === item.id;
    const isSaved = savedAudios.has(item.id);

    return (
      <View style={styles.audioItem}>
        <View style={styles.audioInfo}>
          <Text style={styles.audioTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.audioMeta}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>
                {AUDIO_CATEGORIES.find((c) => c.id === item.category)?.title}
              </Text>
            </View>
            <Text style={styles.duration}>{item.duration}</Text>
          </View>
          {isPlaying && (
            <View>
              <TouchableOpacity
                style={styles.progressBar}
                activeOpacity={1}
                onPress={handleSeek}
                onLayout={(e) => {
                  progressBarWidth.current = e.nativeEvent.layout.width;
                }}
              >
                <View
                  style={[styles.progressFill, { width: `${playingProgress * 100}%` }]}
                />
              </TouchableOpacity>
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.audioActions}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => handlePlayPause(item)}
          >
            <Icon
              name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
              size={44}
              color={isPlaying ? COLORS.secondary : COLORS.dark}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleSave(item.id)}
          >
            <Icon
              name={isSaved ? 'cloud-done' : 'download'}
              size={24}
              color={isSaved ? COLORS.secondary : COLORS.dark}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.statusBarWrapper} edges={['top']}>
      
      <View style={styles.container}>
        <ScreenHeader title="တရားနာ" />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={COLORS.dark} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="ရှာဖွေရန်..."
            placeholderTextColor={COLORS.dark + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color={COLORS.dark} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        <View style={styles.chipContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScroll}
          >
            {AUDIO_CATEGORIES.map(renderCategoryChip)}
          </ScrollView>
        </View>

        {/* Audio List */}
        <FlatList
          data={filteredAudios}
          keyExtractor={(item) => item.id}
          renderItem={renderAudioItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="headphones" size={48} color={COLORS.dark + '40'} />
              <Text style={styles.emptyText}>မတွေ့ပါ</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  statusBarWrapper: {
    backgroundColor: COLORS.primary,
  },
  container: {
    backgroundColor: COLORS.container,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textColor,
  },
  chipContainer: {
    marginTop: 12,
    maxHeight: 50,
  },
  chipScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.dark + '30',
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
  },
  chipTextSelected: {
    color: COLORS.textColor,
  },
  listContent: {
    padding: 16,
    paddingBottom: 500,
  },
  audioItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  audioInfo: {
    flex: 1,
    marginRight: 12,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textColor,
    marginBottom: 6,
  },
  audioMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: COLORS.primary + '30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 11,
    color: COLORS.dark,
    fontWeight: '500',
  },
  duration: {
    fontSize: 12,
    color: COLORS.dark + '99',
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.dark + '20',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    color: COLORS.dark + '99',
  },
  audioActions: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  playButton: {
    padding: 4,
  },
  saveButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.dark + '60',
  },
});

export default AudioScreen;
