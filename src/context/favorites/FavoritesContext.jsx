import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import {
  favoritesReducer,
  FAVORITES_ACTIONS,
  initialFavoritesState,
} from './favoritesReducer';
import {
  getSavedAudios,
  getSavedBooks,
  saveAudios,
  saveBooks,
} from '@/utils/storage';

const FavoritesContext = createContext(null);

const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialFavoritesState);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const [bookIds, audioIds] = await Promise.all([
          getSavedBooks(),
          getSavedAudios(),
        ]);

        if (!mounted) return;

        dispatch({
          type: FAVORITES_ACTIONS.HYDRATE,
          payload: { bookIds, audioIds },
        });
      } catch (error) {
        if (!mounted) return;
        dispatch({
          type: FAVORITES_ACTIONS.HYDRATE,
          payload: { bookIds: [], audioIds: [] },
        });
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    saveBooks(Array.from(state.favoriteBookIds)).catch(() => null);
  }, [state.hydrated, state.favoriteBookIds]);

  useEffect(() => {
    if (!state.hydrated) return;
    saveAudios(Array.from(state.favoriteAudioIds)).catch(() => null);
  }, [state.hydrated, state.favoriteAudioIds]);

  const value = useMemo(
    () => ({
      hydrated: state.hydrated,
      favoriteBookIds: state.favoriteBookIds,
      favoriteAudioIds: state.favoriteAudioIds,
      toggleBook: (id) =>
        dispatch({ type: FAVORITES_ACTIONS.TOGGLE_BOOK, payload: id }),
      toggleAudio: (id) =>
        dispatch({ type: FAVORITES_ACTIONS.TOGGLE_AUDIO, payload: id }),
      isBookFavorite: (id) => state.favoriteBookIds.has(id),
      isAudioFavorite: (id) => state.favoriteAudioIds.has(id),
    }),
    [state.hydrated, state.favoriteBookIds, state.favoriteAudioIds],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider');
  }
  return context;
};

export { FavoritesProvider, useFavorites };
