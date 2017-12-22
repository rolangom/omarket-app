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
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paddingCenter: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: darkGray,
    textAlign: 'center',
    fontFamily: 'Roboto_regular',
  },
  qty: {
    fontSize: 22,
    color: darkGray,
    textAlign: 'center',
    fontFamily: 'Roboto_regular',
  },
  icon: {
    color: darkGray,
    fontSize: 20,
  },
  whiteIcon: {
    color: 'white',
    fontSize: 16,
  },
};

export type Props = {
  value: number,
  max: number,
  styled?: boolean,
  onChange: (number) => void,
};

class QtyInput extends React.Component<Props> {
  onMinusPress = () => this.props.value > 0
    && this.props.onChange(this.props.value - 1);
  onPlusPress = () => this.props.value < this.props.max
    && this.props.onChange(this.props.value + 1);
  render() {
    const { value, styled } = this.props;
    return (
      <View style={styles.main}>
        <Button
          transparent={!styled}
          warning={styled}
          style={!styled ? styles.flex1 : null}
          small={styled}
          parentAlign={styled}
          onPress={this.onMinusPress}
        >
          <Icon
            name="md-remove"
            style={styled ? styles.whiteIcon : styles.icon}
          />
        </Button>
        <View style={!styled ? styles.flex1 : styles.paddingCenter}>
          <Text style={styled ? styles.text : styles.qty}>{padStart(value, 2)}</Text>
        </View>
        <Button
          transparent={!styled}
          dark={styled}
          style={!styled ? styles.flex1 : null}
          small={styled}
          parentAlign={styled}
          onPress={this.onPlusPress}
        >
          <Icon
            name="md-add"
            style={styled ? styles.whiteIcon : styles.icon}
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
