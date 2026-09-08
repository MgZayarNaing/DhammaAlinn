export const FAVORITES_ACTIONS = {
  HYDRATE: 'HYDRATE',
  TOGGLE_BOOK: 'TOGGLE_BOOK',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
};

export const initialFavoritesState = {
  favoriteBookIds: new Set(),
  favoriteAudioIds: new Set(),
  hydrated: false,
};

export const favoritesReducer = (state, action) => {
  switch (action.type) {
    case FAVORITES_ACTIONS.HYDRATE:
      return {
        favoriteBookIds: new Set(action.payload.bookIds || []),
        favoriteAudioIds: new Set(action.payload.audioIds || []),
        hydrated: true,
      };
    case FAVORITES_ACTIONS.TOGGLE_BOOK: {
      const nextBookIds = new Set(state.favoriteBookIds);
      if (nextBookIds.has(action.payload)) {
        nextBookIds.delete(action.payload);
      } else {
        nextBookIds.add(action.payload);
      }
      return {
        ...state,
        favoriteBookIds: nextBookIds,
      };
    }
    case FAVORITES_ACTIONS.TOGGLE_AUDIO: {
      const nextAudioIds = new Set(state.favoriteAudioIds);
      if (nextAudioIds.has(action.payload)) {
        nextAudioIds.delete(action.payload);
      } else {
        nextAudioIds.add(action.payload);
      }
      return {
        ...state,
        favoriteAudioIds: nextAudioIds,
      };
    }
    default:
      return state;
  }
};
