import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import * as shape from 'd3-shape';
import Svg, {Path} from 'react-native-svg';
import {StaticTabbar} from './StaticTabbar';

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

export const Tabbar = ({state, descriptors, navigation}) => {
  const value = new Animated.Value(0);

  const translateX = value.interpolate({
    inputRange: [0, width],
    outputRange: [-width, 0],
  });

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
          <StaticTabbar {...{value, state, descriptors, navigation}} />
        </View>
      </View>
      <SafeAreaView style={styles.container} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor,
  },
});
