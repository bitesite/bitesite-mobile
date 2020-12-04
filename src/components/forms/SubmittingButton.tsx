import React from 'react';
import { Button, Spinner } from '@ui-kitten/components';

function SubmittingButton(props) {
  function handlePress() {
    if(!props.submitting) {
      props.onPress();
    }
  }

  return (
    <Button {...props} onPress={handlePress}>
      {props.submitting ? <Spinner size='tiny' status='info' /> : props.children}
    </Button>
  );
}

export default SubmittingButton;