import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import BookListScreen from './BookListScreen';
import BookDetailScreen from './BookDetailScreen';
import { COLORS } from '@theme/colors';

const Stack = createNativeStackNavigator();

const HomeStack = () => (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.container },
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="BookList" component={BookListScreen} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
    </Stack.Navigator>
);

export default HomeStack;
