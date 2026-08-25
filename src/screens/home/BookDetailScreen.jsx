import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getBookById } from './BookData';
import { COLORS } from '@theme/colors';
import { useState } from 'react';

const defaultBookImg = require('@assets/images/default_book.png');

const BookDetailScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const book = getBookById(bookId);
  const [saved, setSaved] = useState(false);

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>စာအုပ် မတွေ့ပါ</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {book.title}
        </Text>
        <TouchableOpacity
          onPress={() => setSaved(true)}
          style={styles.saveBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon
            name={saved ? 'bookmark' : 'bookmark-border'}
            size={24}
            color={saved ? COLORS.secondary : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverRow}>
          <View style={styles.bookCoverWrap}>
            <View style={styles.bookSpine} />
            <Image source={defaultBookImg} style={styles.cover} />
          </View>
          <View style={styles.meta}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.author}</Text>
            <Text style={styles.description}>{book.description}</Text>
          </View>
        </View>

        <View style={styles.contentBox}>
          <Text style={styles.contentLabel}>အသေးစိတ်</Text>
          <Text style={styles.content}>{book.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.container,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d3c5ae',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textColor,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  saveBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  coverRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  bookCoverWrap: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.dark,
    elevation: 4,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bookSpine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: COLORS.secondary,
    zIndex: 1,
  },
  cover: {
    width: 110,
    height: 160,
    resizeMode: 'cover',
    marginLeft: 8,
  },
  meta: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textColor,
    marginBottom: 6,
  },
  author: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: COLORS.textColor,
    lineHeight: 22,
  },
  contentBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.dark,
    padding: 16,
  },
  contentLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 10,
  },
  content: {
    fontSize: 15,
    color: COLORS.textColor,
    lineHeight: 26,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: COLORS.textColor,
  },
});

export default BookDetailScreen;
