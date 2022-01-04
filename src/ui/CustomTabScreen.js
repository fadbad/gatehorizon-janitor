import * as React from 'react';
import {
  Animated,
  findNodeHandle,
  Text,
  Image,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
const { width, height } = Dimensions.get('screen');

const images = {
  man:
    'https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  women:
    'https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  kids:
    'https://images.pexels.com/photos/5080167/pexels-photo-5080167.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  skullcandy:
    'https://images.pexels.com/photos/5602879/pexels-photo-5602879.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  help:
    'https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
};
const data = Object.keys(images).map((i) => ({
  key: i,
  title: i,
  image: images[i],
  ref: React.createRef(),
}));

const Tab = React.forwardRef(({ item, onItemPress }, ref) => {
  return (
    <TouchableOpacity onPress={onItemPress}>
      <View style={{ paddingHorizontal: 6, marginHorizontal: 4 }} ref={ref}>
        <Text
          style={{
            textTransform: 'uppercase',
            fontSize: 76 / data.length,
            fontWeight: '700',
            color: '#fff',
          }}
        >
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const Indicator = React.memo(({ data, measures, scrollX }) => {
  const inputRange = data.map((_, index) => index * width);
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: data.map((_, index) => measures[index]?.x || 0),
  });
  const itemWidth = scrollX.interpolate({
    inputRange,
    outputRange: data.map((_, index) => measures[index]?.width || 0),
  });

  return (
    <Animated.View
      style={{
        height: 3,
        width: itemWidth,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: -6,
        transform: [{ translateX: translateX }],
      }}
    />
  );
});

const Tabs = ({ data, scrollX, onItemPress }) => {
  const [measures, setMeasures] = React.useState([]);
  const tabContainerRef = React.useRef();

  React.useEffect(() => {
    // const measures = [];
    let measures = [];
    data.forEach((item, index) => {
      item.ref.current.measureLayout(
        findNodeHandle(tabContainerRef.current),
        (x, y, width, height) => {
          measures.push({
            x,
            y,
            width,
            height,
          });
          // Last item was measured. Set the state with all measures
          if (measures.length === data.length) {
            setMeasures(measures);
          }
        }
      );
    });
  }, []);

  return (
    <View
      style={{
        justifyContent: 'center',
        position: 'absolute',
        top: 100,
        width: width,
        left: 0,
      }}
    >
      <View
        style={{ flexDirection: 'row', justifyContent: 'center' }}
        ref={tabContainerRef}
      >
        {data.map((item, index) => {
          return (
            <Tab
              key={item.key}
              item={item}
              ref={item.ref}
              onItemPress={() => onItemPress(index)}
            />
          );
        })}
      </View>
      {measures.length === data.length && (
        <Indicator measures={measures} data={data} scrollX={scrollX} />
      )}
    </View>
  );
};

export default function App() {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const ref = React.useRef();
  const onItemPress = React.useCallback((itemIndex) => {
    ref?.current?.scrollToOffset({
      offset: itemIndex * width,
    });
  });
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Animated.FlatList
        ref={ref}
        bounces={false}
        data={data}
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          }
        )}
        keyExtractor={(item) => item.key}
        pagingEnabled
        horizontal
        renderItem={({ item, index }) => {
          return (
            <View>
              <Image
                source={{ uri: item.image }}
                style={{ width, height, resizeMode: 'cover' }}
              />
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  { backgroundColor: '#000', opacity: 0.5 },
                ]}
              />
            </View>
          );
        }}
      />
      <Tabs data={data} scrollX={scrollX} onItemPress={onItemPress} />
    </View>
  );
}
