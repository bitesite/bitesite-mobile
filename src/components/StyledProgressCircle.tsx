import React, { useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import ProgressCircle from 'react-native-progress-circle'
import LottieView from 'lottie-react-native';
import { Text, useTheme } from '@ui-kitten/components';

function StyledProgressCircle({ percentage, text }) {
  let animation: LottieView | null;
  const theme = useTheme();

  useEffect(() => {
    if(animation) {
      animation.play();
    }
  }, [percentage]);

  return (
    <ProgressCircle
          percent={percentage}
          radius={100}
          borderWidth={12}
          color={theme['color-primary-300']}
          shadowColor={theme['color-primary-900']}
          bgColor={theme['color-primary-900']}
      >
        {
          percentage >= 100 ?
            <View>
              {
                Platform.OS === 'ios' &&
                <LottieView
                  ref={(animationRef) => {
                    animation = animationRef;
                  }}
                  style={{
                    width: 250,
                    height: 250,
                    zIndex: 2,
                  }}
                  source={require('../../assets/9651-winner.json')}
                />
              }
              <View style={styles.completedViewProgressTextContainer}>
                <Text style={styles.progressText}>
                  {text}
                </Text>
              </View>
            </View>
          :
            <Text style={styles.progressText}>
              {text}
            </Text>
        }
      </ProgressCircle>
  );
}

const styles = StyleSheet.create({
  progressText: {
    fontSize: 32,
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: {x: 5, y: 5},
    textShadowRadius: 5,
  },
  completedViewProgressTextContainer: {
    height: 250,
    width: 168,
    zIndex: 4,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StyledProgressCircle;