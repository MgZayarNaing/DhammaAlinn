import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORIES } from './CategoryData';
import { COLORS } from '@theme/colors';
import ScreenHeader from '@/components/ScreenHeader';

const CardItem = ({ image, title, fullWidth, onPress }) => (
  <TouchableOpacity
    style={[styles.cardDefaultWidht, fullWidth && styles.cardFullWidth]}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {CATEGORIES.map((item) => (
            <CardItem
              key={item.id}
              {...item}
              onPress={() =>
                navigation.navigate('BookList', {
                  categoryId: item.id,
                  categoryTitle: item.title,
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const cardGap = 8;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: cardGap * 2,
    paddingBottom: 90,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: cardGap,
  },
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.bold,
    marginBottom: cardGap,
    overflow: 'hidden',
    elevation: 2, // Android shadow
    shadowColor: COLORS.secondary, // IOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardDefaultWidht: {
    width: (width - cardGap * 6) / 2,
  },
  cardFullWidth: {
    width: '100%',
  },
  cardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  cardTitle: {
    padding: cardGap,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textColor,
    textAlign: 'center',
  },
});


export default HomeScreen