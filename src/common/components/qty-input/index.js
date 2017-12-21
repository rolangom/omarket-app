// @flow
import React from 'react';
import {
  Button,
  Text,
  View,
  Icon,
} from 'native-base';
import { darkGray } from '../../../config/constants';
import { padStart } from '../../../utils';

const styles = {
  main: {
    flex: 1,
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: darkGray,
    textAlign: 'center',
    fontFamily: 'Roboto_regular',
  },
  icon: {
    color: darkGray,
    fontSize: 20,
  },
};

export type Props = {
  value: number,
  max: number,
  onChange: (number) => void,
};

class QtyInput extends React.Component<Props> {
  onMinusPress = () => this.props.value > 0
    && this.props.onChange(this.props.value - 1);
  onPlusPress = () => this.props.value < this.props.max
    && this.props.onChange(this.props.value + 1);
  render() {
    const { value } = this.props;
    return (
      <View style={styles.main}>
        <Button
          transparent
          style={styles.flex1}
          onPress={this.onMinusPress}
        >
          <Icon
            name="md-remove"
            style={styles.icon}
          />
        </Button>
        <View style={styles.flex1}>
          <Text style={styles.text}>{padStart(value, 2)}</Text>
        </View>
        <Button
          transparent
          style={styles.flex1}
          onPress={this.onPlusPress}
        >
          <Icon
            name="md-add"
            style={styles.icon}
          />
        </Button>
      </View>
    );
  }
}

QtyInput.defaultProps = {
  value: 0,
  max: 100,
};

export default QtyInput;
