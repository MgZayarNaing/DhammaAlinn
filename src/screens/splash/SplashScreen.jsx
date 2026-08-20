import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GOLD = '#d4af37';
const BG_DARK = '#0a0a0a';

// Dimensions
const BUDDHA_SIZE = SCREEN_WIDTH * 0.75;
const RADIANCE_SIZE = SCREEN_WIDTH * 0.6;

const radianceImg = require('@assets/images/radiance-light.png');
const buddhaImg = require('@assets/images/buddha-statue.png');

const SplashScreen = ({ onAnimationEnd }) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotating radiance light
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      }),
    ).start();

    // Pulsing welcome text
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Bouncing dots with staggered delays
    const bounceAnim = (animVal, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animVal, {
            toValue: -12,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(animVal, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      );

    bounceAnim(dot1, 0).start();
    bounceAnim(dot2, 150).start();
    bounceAnim(dot3, 300).start();

    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        onAnimationEnd?.();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [rotation, pulse, dot1, dot2, dot3, fadeOut, onAnimationEnd]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]} pointerEvents="none">
      {/* Centered composition container */}
      <View style={styles.composition}>
        {/* Layer 1: Rotating radiance light aligned to Buddha's nose */}
        <Animated.Image
          source={radianceImg}
          style={[
            styles.radiance,
            { transform: [{ rotate: spin }] },
          ]}
          resizeMode="contain"
        />

        {/* Layer 2: Buddha statue placed exactly in center */}
        <Image
          source={buddhaImg}
          style={styles.buddha}
          resizeMode="contain"
        />

        {/* Title text anchored below the Buddha */}
        <Text style={styles.title}>ဓမ္မအလင်း</Text>
      </View>

      {/* Loading dots + Welcome text */}
      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View
              key={i}
              style={[styles.dot, { transform: [{ translateY: dot }] }]}
            />
          ))}
        </View>
        <Animated.Text style={[styles.welcome, { opacity: pulse }]}>
          Welcome
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: BG_DARK,
    zIndex: 999,
  },
  composition: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiance: {
    position: 'absolute',
    width: RADIANCE_SIZE,
    height: RADIANCE_SIZE,
    borderRadius: RADIANCE_SIZE / 2,
    opacity: 0.8,
    // Center of radiance is aligned with ~30% down from the top of the Buddha image (Nose area)
    top: '50%',
    marginTop: -(RADIANCE_SIZE / 2) - (BUDDHA_SIZE * 0.30),
    zIndex: 1,
  },
  buddha: {
    position: 'absolute',
    width: BUDDHA_SIZE,
    height: BUDDHA_SIZE,
    top: '50%',
    marginTop: -(BUDDHA_SIZE / 2),
    zIndex: 10,
    // Android shadow
    elevation: 15,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  title: {
    position: 'absolute',
    top: '50%',
    marginTop: (BUDDHA_SIZE / 2) + 20, // Places title cleanly 20px below Buddha's bottom edge
    fontFamily: Platform.select({ ios: 'PlayfairDisplay-Bold', android: 'serif' }),
    fontSize: 34,
    color: GOLD,
    fontWeight: '700',
    letterSpacing: 4,
    textShadowColor: 'rgba(212, 175, 55, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    zIndex: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GOLD,
    // Android glow
    elevation: 8,
    // iOS glow
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  welcome: {
    fontFamily: Platform.select({ ios: 'PlayfairDisplay-Regular', android: 'serif' }),
    fontSize: 12,
    color: GOLD,
    opacity: 0.6,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});

export default SplashScreen;