import { AntDesign } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { icons } from '../assets/icons';

const TabBarButton = (props) => {
    const {isFocused, label, routeName, color} = props
    const scale = useSharedValue(0);

    // Debug logging
    console.log('TabBarButton - routeName:', routeName, 'label:', label);
    console.log('TabBarButton - icon exists:', !!icons[routeName]);

    useEffect(() => {
        scale.value = withSpring(
            typeof isFocused === 'boolean' ? (isFocused ? 1 : 0): isFocused,
            {duration: 350}
        );
    }, [scale, isFocused])

    const animatedIconStyle = useAnimatedStyle(() => {

        const scaleValue = interpolate(
            scale.value,
            [0, 1],
            [1, 1.5]
        )

        const top = interpolate(
            scale.value,
            [0,1],
            [0, 7]
        );

        return {
            transform: [{ scale: scaleValue }],
            top
        }
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scale.value,
            [0, 1],
            [1, 0]
        )
        return {
            opacity
        }
    });

  return (
    <Pressable {...props} style={styles.container}>
        <Animated.View style={[animatedIconStyle]}>
            {
                icons[routeName] ? icons[routeName]({
                    color
                }) : (
                    // Default icon เมื่อไม่พบไอคอน
                    <AntDesign name="question" size={26} color={color} />
                )
            }
        </Animated.View>
        <Animated.Text style={[{
            color: color,
            fontSize: 11,
        }, animatedTextStyle]}>
            {label}
        </Animated.Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    }
})

export default TabBarButton