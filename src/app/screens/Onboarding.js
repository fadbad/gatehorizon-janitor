import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Animated } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { Div, Text, Image, Icon, COLORS, SIZES } from '../../ui'

import ImgOne from '../assets/svgs/onboarding-1.svg'
import ImgCar from '../assets/svgs/car.svg'
import ImgNotif from '../assets/svgs/notifications.svg'
import { useStore } from '../../utils';

const slides = [
    {
        id: '1',
        title: 'Quick & Easy Permits',
        description: 'Uploading permits to your compound has never been easier!',
        image: <ImgOne width={SIZES.width - 100} />,
    },
    {
        id: '2',
        title: 'Accept Visitors in a Glance',
        description: 'Allow visitors to access your properties from your mobile.',
        image: <ImgCar width={SIZES.width - 100} />,
    },
    {
        id: '3',
        title: 'Instant Notifications',
        description: 'Instant notifications from your compound.',
        image: <ImgNotif width={SIZES.width - 100} />,
    },
];

const OnboardingItem = ({ item }) => (
    <Div f={1} center w={SIZES.width}>
        <Div f={3} center>
            {item.image}
            {/* <Image src={item.image} contain fw /> */}
        </Div>
        <Div f={1}>
            <Text center size={20} lh={28} bold color={'primary'} mb={12}>
                {item.title}
            </Text>
            <Text center size={14} color={'secondary'} w={SIZES.width - 100}>
                {item.description}
            </Text>
        </Div>
    </Div>
)

const Paginator = ({ data, scrollX }) => (
    <Div row h={64}>
        {data.map((_, i) => {
            const inputRange = [(i - 1) * SIZES.width, i * SIZES.width, (i + 1) * SIZES.width];

            const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [10, 20, 10],
                extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
            });

            return (
                <Animated.View key={i.toString()}
                    style={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: COLORS.primary,
                        marginHorizontal: 8,
                        width: dotWidth,
                        opacity,
                    }}
                />
            );
        })}
    </Div>
);

const NextButton = ({ percentage, scrollTo }) => {
    const size = 96;
    const strokeWidth = 2;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const progressAnimation = useRef(new Animated.Value(0)).current;
    const progressRef = useRef(null);

    const animation = (toValue) => {
        return Animated.timing(progressAnimation, {
            toValue,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        animation(percentage);
    }, [percentage]);

    useEffect(() => {
        progressAnimation.addListener(
            (value) => {
                const strokeDashoffset = circumference - (circumference * value.value) / 100;

                if (progressRef?.current) {
                    progressRef.current.setNativeProps({
                        strokeDashoffset,
                    });
                }
            },
            [percentage]
        );

        return () => {
            progressAnimation.removeAllListeners();
        };
    }, []);

    return (
        <Div f={1} center>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={center}>
                    <Circle stroke="#E6E7E8" cx={center} cy={center} r={radius} strokeWidth={strokeWidth} />
                    <Circle
                        ref={progressRef}
                        stroke={COLORS.primary}
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                    />
                </G>
            </Svg>
            <Div 
                absolute size={size - 20} center r={100} bg={'secondary'}
                onPress={scrollTo}
            >
                <Icon name={'arrow-right'} size={32} color={'#fff'} />
            </Div>
        </Div>
    );
};

export default Onboarding = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const { setOnBoard } = useStore()

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            console.log('Last item.');
            setOnBoard(true)
        }
    };

    return (
        <Div f={1} safe center bg={'lightGray2'} barcolor={'dark'}>
            <Div f={3}>
                <FlatList
                    data={slides}
                    renderItem={({ item }) => <OnboardingItem item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </Div>
            <Paginator data={slides} scrollX={scrollX} />
            <NextButton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slides.length)} />
        </Div>
    );
};
