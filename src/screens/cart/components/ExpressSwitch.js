// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { State } from '../../../common/types';
import { setIsRushService } from '../../../ducks/global';
import CommonSwitch from './CommonSwitch';

type Props = {
  value: boolean,
  currency: string,
  price: number,
  onChange: boolean => void,
};

const ExpressSwitch = ({ value, onChange, currency, price }: Props) => (
  <CommonSwitch
    title="Servicio Rush"
    subtitle={`+ ${currency} ${price}`}
    value={value}
    onChange={onChange}
  />
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