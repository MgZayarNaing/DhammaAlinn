import React, { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import AppNavigator from '@/navigation/AppNavigator'
import SplashScreen from '@screens/splash/SplashScreen'

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
      <AppNavigator />
    </SafeAreaProvider>
  )
}

export default App