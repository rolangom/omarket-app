// @flow
import React from 'react';
import { StyleSheet } from 'react-native';
// import { } from 'recompose';
import {
  Text,
  View,
  Button,
  Icon,
} from 'native-base';
import { darkGray } from '../../utils/constants';
import { padStart } from '../../utils';
// import CircleButton from '../CircleButton';

const styles = StyleSheet.create({
  main1: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    // flex: 1,
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
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: darkGray,
    textAlign: 'center',
    fontFamily: 'Roboto_regular',
  },
  icon: {
    color: darkGray,
    fontSize: 32,
  },
  iconS: {
    color: darkGray,
    fontSize: 22,
  },
  qty: {
    fontSize: 22,
    color: darkGray,
    textAlign: 'center',
    fontFamily: 'Roboto_regular',
  },
});

export type Props = {
  value: number,
  stretch?: boolean,
  max: number,
  flex?: boolean,
  onChange: (number) => void,
};

class QtyInput extends React.Component<Props> {
  onMinusPress = () => this.props.value > 0
    && this.props.onChange(-1);
  onPlusPress = () => this.props.max > 0
    // && ((this.props.value + 1) <= (this.props.value + this.props.max))
    && this.props.onChange(1);
  render() {
    const { value, flex, stretch } = this.props;
    return (
      <View style={flex ? styles.main1 : styles.main}>
        <Button
          primary
          rounded
          transparent
          stretch={stretch}
          onPress={this.onMinusPress}
        >
          <Icon name="ios-remove-circle-outline" style={stretch ? styles.iconS : styles.icon} />
        </Button>
        <View style={flex ? styles.flex1 : styles.paddingCenter}>
          <Text style={stretch ? styles.text : styles.qty}>{padStart(value, 2)}</Text>
        </View>
        <Button
          primary
          rounded
          transparent
          stretch={stretch}
          onPress={this.onPlusPress}
        >
          <Icon name="ios-add-circle-outline" style={stretch ? styles.iconS : styles.icon} />
        </Button>
      </View>
    );
  }
}

QtyInput.defaultProps = {
  value: 0,
  max: 100,
  stretch: false,
};

export default QtyInput;
