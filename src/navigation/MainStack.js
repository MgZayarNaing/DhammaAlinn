import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
        </Stack.Navigator>
    )
}

export default MainStack