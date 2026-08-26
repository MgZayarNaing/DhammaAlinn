import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCHES_KEY = '@search/recent_searches';
const MAX_RECENT_SEARCHES = 10;

/**
 * Persists the user's recent search queries in AsyncStorage.
 * Keeps at most MAX_RECENT_SEARCHES entries, most-recent-first, de-duplicated.
 */
const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [ready, setReady] = useState(false);

  // Load saved queries once on mount.
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        if (mounted && Array.isArray(parsed)) {
          setRecentSearches(parsed.filter((item) => typeof item === 'string'));
        }
      } catch (error) {
        console.log('Failed to load recent searches:', error);
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Persist whenever the list changes (only after the initial load).
  useEffect(() => {
    if (!ready) {
      return;
    }
    AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches)).catch(
      (error) => console.log('Failed to save recent searches:', error),
    );
  }, [recentSearches, ready]);

  const addRecentSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    setRecentSearches((prev) => [
      trimmed,
      ...prev.filter((item) => item !== trimmed),
    ].slice(0, MAX_RECENT_SEARCHES));
  };

  const removeRecentSearch = (query) => {
    setRecentSearches((prev) => prev.filter((item) => item !== query));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
};

export default useRecentSearches;