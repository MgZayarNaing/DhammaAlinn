/**
 * Search service for the Search screen.
 *
 * NOTE: All data currently comes from local mock data (AUDIO_DATA / BOOKS).
 * Every exported function is async and returns plain serializable objects,
 * so these can later be replaced with real API responses without touching
 * the Search screen itself.
 *
 * TODO(API): swap the mock lookups inside `searchAll` / `getRecommendedItems`
 * for real endpoints, e.g. `api.get('/search?q=...')`.
 */
import { AUDIO_CATEGORIES, AUDIO_DATA } from '@screens/audio/AudioData';
import { BOOKS, searchBooks } from '@screens/home/BookData';
import { CATEGORIES } from '@screens/home/CategoryData';

// Simulated network latency (ms) so the UI behaves the same as with a real API.
// Set to 0 to resolve immediately.
const MOCK_LATENCY_MS = 250;

export const SEARCH_RESULT_TYPES = {
  AUDIO: 'audio',
  BOOK: 'book',
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getAudioCategoryTitle = (categoryId) =>
  AUDIO_CATEGORIES.find((category) => category.id === categoryId)?.title ?? '';

const getBookCategoryTitle = (categoryId) =>
  CATEGORIES.find(
    (category) => String(category.id) === String(categoryId),
  )?.title ?? '';

// Unified shape shared by audio and book results so the UI can render both
// with one row component (and stay unchanged when the API arrives).
const normalizeAudio = (audio) => ({
  key: `${SEARCH_RESULT_TYPES.AUDIO}-${audio.id}`,
  id: audio.id,
  type: SEARCH_RESULT_TYPES.AUDIO,
  title: audio.title,
  subtitle: getAudioCategoryTitle(audio.category),
  meta: audio.duration,
});

const normalizeBook = (book) => ({
  key: `${SEARCH_RESULT_TYPES.BOOK}-${book.id}`,
  id: book.id,
  type: SEARCH_RESULT_TYPES.BOOK,
  title: book.title,
  subtitle: book.author,
  meta: getBookCategoryTitle(book.categoryId),
});

const searchAudios = (query) => {
  const lowerQuery = query.toLowerCase();
  return AUDIO_DATA.filter(
    (audio) =>
      audio.title.toLowerCase().includes(lowerQuery) ||
      audio.text.toLowerCase().includes(lowerQuery),
  );
};

/**
 * Search both audios and books.
 * Resolves: { audios: ResultItem[], books: ResultItem[], total: number }
 */
export const searchAll = async (query) => {
  const trimmed = query.trim();
  if (!trimmed) {
    return { audios: [], books: [], total: 0 };
  }

  await delay(MOCK_LATENCY_MS);

  // TODO(API): replace with e.g. `return api.search(trimmed);`
  const audios = searchAudios(trimmed).map(normalizeAudio);
  const books = searchBooks(trimmed).map(normalizeBook);

  return { audios, books, total: audios.length + books.length };
};

/**
 * Items suggested to the user when they have no recent search history.
 * Resolves: ResultItem[]
 */
export const getRecommendedItems = async () => {
  await delay(MOCK_LATENCY_MS);

  // TODO(API): replace with e.g. `return api.recommendations();`
  const RECOMMENDED_AUDIO_IDS = ['2', '4', '15'];
  const RECOMMENDED_BOOK_IDS = ['1-1', '4-1', '5-1'];

  const audios = AUDIO_DATA.filter((audio) =>
    RECOMMENDED_AUDIO_IDS.includes(audio.id),
  ).map(normalizeAudio);
  const books = BOOKS.filter((book) =>
    RECOMMENDED_BOOK_IDS.includes(book.id),
  ).map(normalizeBook);

  // Interleave audios and books for a mixed recommendation list.
  const combined = [];
  const maxLength = Math.max(audios.length, books.length);
  for (let i = 0; i < maxLength; i += 1) {
    if (audios[i]) combined.push(audios[i]);
    if (books[i]) combined.push(books[i]);
  }
  return combined;
};