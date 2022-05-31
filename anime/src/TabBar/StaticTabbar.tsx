import React, {useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Routes} from '../routes';
import {getTabIcon} from '../helpers';
interface StaticTabbarProps {
  value: Animated.Value;
}

const {width} = Dimensions.get('window');

export const StaticTabbar = ({
  value,
  state,
  descriptors,
  navigation,
}: StaticTabbarProps) => {
  // console.log('value', value);
  // console.log('state', state);
  // console.log('descriptors', descriptors);
  // console.log('navigation', navigation);

  const values = useMemo(() => {
    return state.routes.map((tab, index) => {
      return new Animated.Value(index === 0 ? 1 : 0);
    });
  }, [state]);

  console.log('values', values);
  // const values = state.routes.map((tab, index) => {
  //   return new Animated.Value(index === 0 ? 1 : 0);
  // });

  const onPress = (index: number) => {
    const tabWidth = width / 3;

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
      {state.routes.map((tab, key) => {
        const tabWidth = width / state.routes.length;

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

        const {options} = descriptors[tab.key];

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : tab.name;

        const isFocused = state.index === key;

        return (
          <React.Fragment {...{key}}>
            <TouchableWithoutFeedback
              onPress={async () => {
                await onPress(key);

                const event = navigation.emit({
                  type: 'tabPress',
                  target: tab.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate({name: tab.name, merge: true});
                }
              }}>
              <Animated.View style={[styles.tab, {opacity}]}>
                <Ionicons
                  name={getTabIcon(tab.name)}
                  size={tab.name === Routes.CREATE_POST_STACK ? 30 : 25}
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
                  name={getTabIcon(tab.name)}
                  size={tab.name === Routes.CREATE_POST_STACK ? 34 : 28}
                  color="#1e90ff"
                  style={{
                    paddingLeft: tab.name === Routes.CREATE_POST_STACK ? 2 : 0,
                    paddingTop: tab.name === Routes.CREATE_POST_STACK ? 1 : 0,
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
