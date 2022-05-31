import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';

import {BottomTabNavigation} from './BottomTabNavigation';
import {Tabbar} from './TabBar/Tabbar';

export const AppNavigation = () => {
  return (
    <NavigationContainer>
      <BottomTabNavigation />
      {/* <View style={styles.container}>
        <Tabbar />
      </View> */}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    justifyContent: 'flex-end',
  },
});
