import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getBooksByCategory } from './BookData';
import { COLORS } from '@theme/colors';

const defaultBookImg = require('@assets/images/default_book.png');

const BookItem = ({ book, onPress }) => (
  <View style={styles.bookWrapper}>
    <TouchableOpacity style={styles.book} activeOpacity={0.85} onPress={onPress}>
      <Image source={defaultBookImg} style={styles.bookCover} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={1}>
          {book.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {book.author}
        </Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.saveBtn}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Icon
        name={'bookmark'}
        size={22}
        color={COLORS.secondary}
      />
    </TouchableOpacity>
  </View>
);

const BookListScreen = ({ route, navigation }) => {
  const { categoryId, categoryTitle } = route.params;
  const books = getBooksByCategory(categoryId);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {categoryTitle}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {books.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              onPress={() => navigation.navigate('BookDetail', { bookId: book.id })}

            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const gap = 12;
const bookWidth = (width - gap * 5) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.container,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: gap,
    paddingVertical: gap,
    borderBottomWidth: 1,
    borderBottomColor: '#d3c5ae',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textColor,
    textAlign: 'center',
    marginHorizontal: gap,
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    padding: gap * 2,
    paddingBottom: 90,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap,
  },
  bookWrapper: {
    width: bookWidth,
    position: 'relative',
  },
  book: {
    backgroundColor: COLORS.container,
    borderRadius: 8,
    padding: gap,
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  bookCover: {
    width: '100%',
    height: 140,
    resizeMode: 'contain',
  },
  bookInfo: {
    width: '100%',
    paddingTop: gap,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textColor,
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: COLORS.dark,
  },
  saveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(247, 236, 222, 0.9)',
    borderRadius: 16,
    padding: 4,
  },
});

export default BookListScreen;
