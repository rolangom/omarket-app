// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-native';
import { ListItem, Body, Text, Right } from 'native-base';
import { darkGray, lightGray } from '../../../common/utils/constants';
import type { State } from '../../../common/types';
import { setIsRushService } from '../../../ducks/global';

type Props = {
  value: boolean,
  currency: string,
  price: number,
  onChange: boolean => void,
};

const ExpressSwitch = ({ value, onChange, currency, price }: Props) => (
  <ListItem>
    <Body>
      <Text>Servicio Rush</Text>
      <Text note>
        {' '}
        + {currency} {price}
      </Text>
    </Body>
    <Right>
      <Switch
        value={value}
        onValueChange={onChange}
        onTintColor={lightGray}
        thumbTintColor={darkGray}
      />
    </Right>
  </ListItem>
);

export default connect(
  (state: State) => ({
    currency: state.global.currency,
    price: state.global.rushPrice,
    value: state.global.isRushOrder,
  }),
  {
    onChange: setIsRushService,
  },
)(ExpressSwitch);

/*
 */