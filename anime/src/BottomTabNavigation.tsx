import React, {useMemo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import * as shape from 'd3-shape';
import Svg, {Path} from 'react-native-svg';
// import {StaticTabbar} from './StaticTabbar';

import {Routes} from './routes';
import {Main} from './screens/Main';
import {Post} from './screens/Post';
import {Tabbar} from './TabBar/Tabbar';
import {getTabIcon} from './helpers';
import {Messages} from './screens/Messages';

const Tab = createBottomTabNavigator();

const Tabs = [
  {
    name: Routes.DASHBOARD_STACK,
    component: Main,
  },
  {
    name: Routes.CREATE_POST_STACK,
    component: Post,
  },
  {
    name: Routes.MESSAGE_STACK,
    component: Messages,
  },
];

const height = 50;
const {width} = Dimensions.get('window');
const tabWidth = width / 3;
const backgroundColor = '#363636';
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const getPath = (): string => {
  const left = shape
    .line()
    .x(d => d.x)
    .y(d => d.y)([
    {x: 0, y: 0},
    {x: width, y: 0},
  ]);

  const tab = shape
    .line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(shape.curveBasis)([
    {x: width, y: 0},
    {x: width + 5, y: 0},
    {x: width + 10, y: 10},
    {x: width + 15, y: height},
    {x: width + tabWidth - 15, y: height},
    {x: width + tabWidth - 10, y: 10},
    {x: width + tabWidth - 5, y: 0},
    {x: width + tabWidth, y: 0},
  ]);

  const right = shape
    .line()
    .x(d => d.x)
    .y(d => d.y)([
    {x: width + tabWidth, y: 0},
    {x: width * 2, y: 0},
    {x: width * 2, y: height},
    {x: 0, y: height},
    {x: 0, y: 0},
  ]);

  return `${left} ${tab} ${right}`;
};
const d = getPath();

export const BottomTabNavigation = () => {
  const value = new Animated.Value(0);

  const translateX = value.interpolate({
    inputRange: [0, width],
    outputRange: [-width, 0],
  });

  const values = useMemo(() => {
    return Tabs.map((tab, index) => {
      return new Animated.Value(index === 0 ? 1 : 0);
    });
  }, []);

  const onPress = (index: number) => {
    console.log('index', index);
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
    <Tab.Navigator
      tabBar={props => {
        return (
          <>
            <View style={{backgroundColor: '#242424'}} {...{height, width}}>
              <AnimatedSvg
                width={width * 2}
                {...{height}}
                style={{transform: [{translateX}]}}>
                <Path fill={backgroundColor} {...{d}} />
              </AnimatedSvg>
              <View style={StyleSheet.absoluteFill}>
                {/* <StaticTabbar {...{value, state, descriptors, navigation}} /> */}

                <View style={styles.box}>
                  {props.state.routes.map((tab, key) => {
                    const tabWidth = width / 3;

                    const cursor = tabWidth * key;

                    const opacity = value.interpolate({
                      inputRange: [
                        cursor - tabWidth,
                        cursor,
                        cursor + tabWidth,
                      ],
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

                    const {options} = props.descriptors[tab.key];

                    const label =
                      options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : tab.name;

                    const isFocused = props.state.index === key;

                    return (
                      <React.Fragment {...{key}}>
                        <TouchableWithoutFeedback
                          onPress={async () => {
                            await onPress(key);

                            const event = props.navigation.emit({
                              type: 'tabPress',
                              target: tab.key,
                              canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                              props.navigation.navigate({
                                name: tab.name,
                                merge: true,
                              });
                            }
                          }}>
                          <Animated.View style={[styles.tab, {opacity}]}>
                            <Ionicons
                              name={getTabIcon(tab.name)}
                              size={
                                tab.name === Routes.CREATE_POST_STACK ? 30 : 25
                              }
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
                              size={
                                tab.name === Routes.CREATE_POST_STACK ? 34 : 30
                              }
                              color="#1e90ff"
                              style={{
                                paddingLeft:
                                  tab.name === Routes.CREATE_POST_STACK ? 2 : 0,
                                paddingTop:
                                  tab.name === Routes.CREATE_POST_STACK ? 1 : 0,
                              }}
                            />
                          </View>
                        </Animated.View>
                      </React.Fragment>
                    );
                  })}
                </View>
              </View>
            </View>
            <SafeAreaView style={styles.container} />
          </>
        );
      }}
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
      })}>
      {Tabs.map((element, index) => {
        return (
          <Tab.Screen
            key={index}
            name={element.name}
            component={element.component}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor,
  },

  box: {
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
    // backgroundColor: '#363636',
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
