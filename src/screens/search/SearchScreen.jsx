import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/components/ScreenHeader';
import { COLORS } from '@theme/colors';
import useRecentSearches from './useRecentSearches';
import {
  SEARCH_RESULT_TYPES,
  getRecommendedItems,
  searchAll,
} from './searchService';

const SEARCH_DEBOUNCE_MS = 350;

const SECTION_TITLES = {
  audio: 'အသံတရားတော်များ',
  book: 'စာအုပ်များ',
};

const TYPE_LABELS = {
  [SEARCH_RESULT_TYPES.AUDIO]: 'အသံ',
  [SEARCH_RESULT_TYPES.BOOK]: 'စာအုပ်',
};

const ResultRow = ({ item, onPress }) => {
  const isAudio = item.type === SEARCH_RESULT_TYPES.AUDIO;
  return (
    <TouchableOpacity
      style={styles.resultRow}
      activeOpacity={0.85}
      onPress={() => onPress(item)}
    >
      <View
        style={[
          styles.resultIconWrap,
          isAudio ? styles.iconAudio : styles.iconBook,
        ]}
      >
        <Icon
          name={isAudio ? 'play-circle-outline' : 'menu-book'}
          size={24}
          color={isAudio ? COLORS.dark : COLORS.secondary}
        />
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.resultMeta}>
          <View
            style={[styles.typeTag, isAudio ? styles.tagAudio : styles.tagBook]}
          >
            <Text style={styles.typeTagText}>{TYPE_LABELS[item.type]}</Text>
          </View>
          <Text style={styles.resultSubtitle} numberOfLines={1}>
            {[item.subtitle, item.meta].filter(Boolean).join(' • ')}
          </Text>
        </View>
      </View>
      <Icon name="chevron-right" size={24} color={COLORS.dark + '80'} />
    </TouchableOpacity>
  );
};

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ audios: [], books: [], total: 0 });
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useRecentSearches();

  // Guards against out-of-order responses (stale results overwriting fresh ones).
  const searchSequenceRef = useRef(0);
  const lastSearchedQueryRef = useRef('');

  // Load recommended items once — shown only when there is no recent history.
  useEffect(() => {
    let mounted = true;
    getRecommendedItems().then((items) => {
      if (mounted) {
        setRecommendedItems(items);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const runSearch = useCallback(async rawQuery => {
    const trimmed = rawQuery.trim();
    // Skip duplicated searches for the exact same term.
    if (trimmed && trimmed === lastSearchedQueryRef.current) {
      return;
    }
    const sequence = ++searchSequenceRef.current;

    if (!trimmed) {
      lastSearchedQueryRef.current = '';
      setResults({ audios: [], books: [], total: 0 });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchAll(trimmed);
      if (searchSequenceRef.current === sequence) {
        lastSearchedQueryRef.current = trimmed;
        setResults(response);
      }
    } catch (error) {
      console.log('Search failed:', error);
      if (searchSequenceRef.current === sequence) {
        setResults({ audios: [], books: [], total: 0 });
      }
    } finally {
      if (searchSequenceRef.current === sequence) {
        setIsSearching(false);
      }
    }
  }, []);

  // Debounced live search while typing.
  useEffect(() => {
    if (!query.trim()) {
      runSearch('');
      return undefined;
    }
    const timer = setTimeout(() => runSearch(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, runSearch]);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    addRecentSearch(trimmed);
    runSearch(trimmed);
  };

  const handlePressRecent = recentQuery => {
    setQuery(recentQuery);
    runSearch(recentQuery);
  };

  const handlePressResult = item => {
    if (item.type === SEARCH_RESULT_TYPES.BOOK) {
      // Book detail lives inside the Home stack.
      navigation.navigate('Home', {
        screen: 'BookDetail',
        params: { bookId: item.id },
      });
    } else {
      // Audio playback currently lives on the Audio tab screen.
      navigation.navigate('Audio');
    }
  };

  const isSearchActive = query.trim().length > 0;
  const hasNoResults = isSearchActive && !isSearching && results.total === 0;

  // Build a flat row list so one FlatList can render every screen state.
  const listData = useMemo(() => {
    const rows = [];

    if (isSearchActive) {
      if (results.audios.length > 0) {
        rows.push({
          kind: 'section-header',
          key: 'header-audio',
          title: SECTION_TITLES.audio,
        });
        results.audios.forEach(item =>
          rows.push({ kind: 'result', key: item.key, item }),
        );
      }
      if (results.books.length > 0) {
        rows.push({
          kind: 'section-header',
          key: 'header-book',
          title: SECTION_TITLES.book,
        });
        results.books.forEach(item =>
          rows.push({ kind: 'result', key: item.key, item }),
        );
      }
      return rows;
    }

    if (recentSearches.length > 0) {
      // User already has search history → show it.
      rows.push({
        kind: 'section-header',
        key: 'header-recent',
        title: 'မကြာသေးမီ ရှာဖွေမှုများ',
        showClearAll: true,
      });
      recentSearches.forEach(recentQuery =>
        rows.push({
          kind: 'recent',
          key: `recent-${recentQuery}`,
          query: recentQuery,
        }),
      );
    } else {
      // No history yet → show recommended items instead.
      rows.push({
        kind: 'section-header',
        key: 'header-recommended',
        title: 'အကြံပြုထားသော တရားတော်နှင့် စာအုပ်များ',
      });
      recommendedItems.forEach(item =>
        rows.push({ kind: 'result', key: `recommended-${item.key}`, item }),
      );
    }

    return rows;
  }, [isSearchActive, results, recentSearches, recommendedItems]);

  const renderItem = ({ item }) => {
    switch (item.kind) {
      case 'section-header':
        return (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            {item.showClearAll ? (
              <TouchableOpacity
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={clearRecentSearches}
              >
                <Text style={styles.clearAllText}>အားလုံး ရှင်းလင်း</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        );
      case 'recent':
        return (
          <View style={styles.recentRow}>
            <TouchableOpacity
              style={styles.recentButton}
              activeOpacity={0.85}
              onPress={() => handlePressRecent(item.query)}
            >
              <Icon name="history" size={20} color={COLORS.dark + '99'} />
              <Text style={styles.recentText} numberOfLines={1}>
                {item.query}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.recentRemoveBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => removeRecentSearch(item.query)}
            >
              <Icon name="close" size={18} color={COLORS.dark + '80'} />
            </TouchableOpacity>
          </View>
        );
      case 'result':
        return <ResultRow item={item.item} onPress={handlePressResult} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.statusBarWrapper} edges={['top']}>
      <ScreenHeader title="ရှာဖွေ" />
      <View style={styles.container}>
        {/* Search bar */}
        <View style={styles.searchBar}>
          <Icon
            name="search"
            size={22}
            color={COLORS.dark + '99'}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="တရားတော် သို့မဟုတ် စာအုပ် ရှာဖွေပါ..."
            placeholderTextColor={COLORS.dark + '66'}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            autoCorrect={false}
          />
          {isSearchActive ? (
            <TouchableOpacity
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => setQuery('')}
            >
              <Icon name="cancel" size={20} color={COLORS.dark + '80'} />
            </TouchableOpacity>
          ) : null}
        </View>

        {isSearching ? (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="small"
            color={COLORS.secondary}
          />
        ) : null}

        {hasNoResults ? (
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={48} color={COLORS.dark + '40'} />
            <Text style={styles.emptyTitle}>ရှာဖွေမှု မတွေ့ပါ</Text>
            <Text style={styles.emptySubtitle}>
              စာလုံးပေါင်းအတိုချုပ်ဖြင့် ထပ်မံ ကြိုးစားကြည့်ပါ။
            </Text>
          </View>
        ) : (
          <>
            {isSearchActive && results.total > 0 ? (
              <Text style={styles.resultCount}>
                ရလဒ် {results.total} ခု တွေ့ရှိသည်
              </Text>
            ) : null}
            <FlatList
              data={listData}
              keyExtractor={listItem => listItem.key}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
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
    flex: 1,
    backgroundColor: COLORS.container,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 12,
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
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  loadingIndicator: {
    marginTop: 16,
  },
  resultCount: {
    marginHorizontal: 16,
    marginTop: 14,
    fontSize: 13,
    color: COLORS.dark,
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textColor,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  recentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 12,
  },
  recentText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.textColor,
  },
  recentRemoveBtn: {
    padding: 10,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconAudio: {
    backgroundColor: COLORS.primary + '33',
  },
  iconBook: {
    backgroundColor: COLORS.secondary + '26',
  },
  resultInfo: {
    flex: 1,
    marginRight: 8,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textColor,
    marginBottom: 6,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagAudio: {
    backgroundColor: COLORS.primary + '30',
  },
  tagBook: {
    backgroundColor: COLORS.secondary + '30',
  },
  typeTagText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.dark,
  },
  resultSubtitle: {
    flexShrink: 1,
    fontSize: 12,
    color: COLORS.dark + '99',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark + '99',
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
    color: COLORS.dark + '80',
  },
});

export default SearchScreen;



