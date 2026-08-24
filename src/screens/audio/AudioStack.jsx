import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AudioScreen from './AudioScreen';
import { COLORS } from '@theme/colors';

const Stack = createNativeStackNavigator();

const AudioStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: COLORS.container },
    }}
  >
    <Stack.Screen name="AudioMain" component={AudioScreen} />
  </Stack.Navigator>
);

export default AudioStack;
