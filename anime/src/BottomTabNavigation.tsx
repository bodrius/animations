import React from 'react';
import {StyleSheet, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Main} from './screens/Main';
import {Post} from './screens/Post';
import {Messages} from './screens/Messages';

const Tab = createBottomTabNavigator();

export const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBarContainer,
        },
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({focused, color}) => (
            <>
              <View style={{marginBottom: 2}}>
                <Ionicons
                  name="home"
                  size={30}
                  color={focused ? color : 'white'}
                />
              </View>
            </>
          ),
        }}
        name="Main"
        component={Main}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused, color}) => (
            <>
              <View style={{marginBottom: 2}}>
                <Ionicons
                  name="add-circle-outline"
                  size={33}
                  color={focused ? color : 'white'}
                />
              </View>
            </>
          ),
        }}
        name="Post"
        component={Post}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused, color}) => (
            <>
              <View style={{marginBottom: 2}}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={30}
                  color={focused ? color : 'white'}
                />
              </View>
            </>
          ),
        }}
        name="Messages"
        component={Messages}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#242424',
    borderTopWidth: 0,
  },

  tabBarLabelStyle: {
    color: 'white',
    fontSize: 12,
  },
});
