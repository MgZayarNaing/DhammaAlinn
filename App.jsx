import React, { useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar, StyleSheet } from 'react-native'
import AppNavigator from '@/navigation/AppNavigator'
import SplashScreen from '@screens/splash/SplashScreen'

const App = () => {

  const [showSplash, setShowSplash] = useState(true);

  if (showSplash)
    return <SplashScreen onAnimationEnd={() => setShowSplash(false)} />

  return (
    <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <AppNavigator />
    </SafeAreaProvider>
  )
}

export default App