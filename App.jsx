import React, { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import AppNavigator from '@/navigation/AppNavigator'
import SplashScreen from '@screens/splash/SplashScreen'
import { FavoritesProvider } from '@/context/favorites/FavoritesContext'

const App = () => {

  const [showSplash, setShowSplash] = useState(true);

  if (showSplash)
    return <SplashScreen onAnimationEnd={() => setShowSplash(false)} />

  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle="dark-content"
      />
      <FavoritesProvider>
        <AppNavigator />
      </FavoritesProvider>
    </SafeAreaProvider>
  )
}

export default App