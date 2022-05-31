import React from 'react';
import {Text, View} from 'react-native';

export const Main = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#242424',
      }}>
      <Text style={{fontSize: 30, color: 'white'}}> MAIN</Text>
    </View>
  );
};
