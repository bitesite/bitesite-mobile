import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import ProgressCircle from 'react-native-progress-circle'
import { Button, Card, Text, useTheme } from '@ui-kitten/components';

function WeeklyBillableHoursProgress() {
  let animation: LottieView | null;

  const theme = useTheme();
  const currentWeeklyBillableHours = 23;
  const weeklyBillableHoursTarget = 22;
  const percentage = currentWeeklyBillableHours / weeklyBillableHoursTarget * 100.00;

  function authorizeFreshbooks() {
    
  }

  useEffect(() => {
    if(animation) {
      animation.play();
    }
  }, []);

  return (
    <Card style={styles.card} appearance='outline'>
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
            <LottieView
              ref={(animationRef) => {
                animation = animationRef;
              }}
              style={{
                width: 200,
                height: 200,
              }}
              source={require('../../assets/9651-winner.json')}
            />

          :
            <Text style={styles.progressText}>{`${currentWeeklyBillableHours}/${weeklyBillableHoursTarget}`}</Text>
        }
      </ProgressCircle>
      <Text style={styles.bhtCaption}>WBHT</Text>
      <Button onPress={authorizeFreshbooks}>Authorize FreshBooks</Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    alignItems: 'center',
  },
  bhtCaption: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: 10,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 32,
    color: 'white',
  }
});

export default WeeklyBillableHoursProgress;