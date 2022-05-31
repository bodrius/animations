import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Tab {
  name: string;
}

interface StaticTabbarProps {
  tabs: Tab[];
  value: Animated.Value;
}

const {width} = Dimensions.get('window');

export const StaticTabbar = ({tabs, value}: StaticTabbarProps) => {
  const values = tabs.map(
    (tab, index) => new Animated.Value(index === 0 ? 1 : 0),
  );

  const onPress = (index: number) => {
    const tabWidth = width / tabs.length;
    Animated.sequence([
      Animated.parallel(
        values.map(v =>
          Animated.timing(v, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ),
      ),
      Animated.parallel([
        Animated.spring(value, {
          toValue: tabWidth * index,
          useNativeDriver: true,
        }),
        Animated.spring(values[index], {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, key) => {
        const tabWidth = width / tabs.length;
        const cursor = tabWidth * key;
        const opacity = value.interpolate({
          inputRange: [cursor - tabWidth, cursor, cursor + tabWidth],
          outputRange: [1, 0, 1],
          extrapolate: 'clamp',
        });
        const translateY = values[key].interpolate({
          inputRange: [0, 1],
          outputRange: [64, 0],
          extrapolate: 'clamp',
        });
        const opacity1 = values[key].interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        });
        return (
          <React.Fragment {...{key}}>
            <TouchableWithoutFeedback onPress={() => onPress(key)}>
              <Animated.View style={[styles.tab, {opacity}]}>
                <Ionicons
                  name={tab.name}
                  size={tab.name === 'add-circle-outline' ? 30 : 25}
                  color={'white'}
                />
              </Animated.View>
            </TouchableWithoutFeedback>
            <Animated.View
              style={{
                position: 'absolute',
                top: -3,
                left: tabWidth * key,
                width: tabWidth,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: opacity1,
                transform: [{translateY}],
              }}>
              <View style={styles.activeIcon}>
                <Ionicons
                  name={tab.name}
                  size={tab.name === 'add-circle-outline' ? 34 : 28}
                  color="#1e90ff"
                  style={{
                    paddingLeft: tab.name === 'add-circle-outline' ? 2 : 0,
                    paddingTop: tab.name === 'add-circle-outline' ? 1 : 0,
                  }}
                />
              </View>
            </Animated.View>
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  activeIcon: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
