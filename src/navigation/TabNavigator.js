import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeStack from '@screens/home/HomeStack';
import AudioScreen from "@screens/audio/AudioScreen";
import SearchScreen from "@screens/search/SearchScreen";
import FavoriteScreen from "@screens/favorite/FavoriteScreen";
import SettingsScreen from "@screens/setting/SettingScreen";
import { COLORS } from '@theme/colors';

const Tab = createBottomTabNavigator();

// Custom Pill Icon Component
const TabIcon = ({ name, focused }) => (
  <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
    <Icon
      name={name}
      size={24}
      color={focused ? COLORS.primary : COLORS.textColor}
    />
  </View>
);

const TabNavigator = () => {
  return (<Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: true,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.label,
      tabBarActiveTintColor: COLORS.bold,
      tabBarInactiveTintColor: COLORS.textColor,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{
        tabBarLabel: 'ပင်မ',
        tabBarIcon: ({ focused }) => (
          <TabIcon name="home" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Audio"
      component={AudioScreen}
      options={{
        tabBarLabel: 'တရားနာ',
        tabBarIcon: ({ focused }) => (
          <TabIcon
            name={focused ? 'play-circle-filled' : 'play-circle-outline'}
            focused={focused}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Search"
      component={SearchScreen}
      options={{
        tabBarLabel: 'ရှာဖွေ',
        tabBarIcon: ({ focused }) => (
          <TabIcon name="search" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Favorite"
      component={FavoriteScreen}
      options={{
        tabBarLabel: 'နှစ်သက်',
        tabBarIcon: ({ focused }) => (
          <TabIcon
            name={focused ? 'favorite' : 'favorite-border'}
            focused={focused}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarLabel: 'ပြင်ဆင်',
        tabBarIcon: ({ focused }) => (
          <TabIcon name="settings" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>);
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.container,
  },
  tabBar: {
    height: 80,
    backgroundColor: '#f7ecde',
    borderTopWidth: 1,
    borderTopColor: '#d3c5ae',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 8,
    paddingBottom: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconContainer: {
    width: 64,
    height: 32,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    backgroundColor: COLORS.secondary,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default TabNavigator;