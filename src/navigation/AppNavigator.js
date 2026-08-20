import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from './RootNavigator';
import MainStack from './MainStack'

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <MainStack />
    </NavigationContainer>
  )
}

export default AppNavigator