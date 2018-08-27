// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { State } from '../../../common/types';
import { visibleIf } from '../../../common/components/visible';
import { setUsePoints } from '../../../ducks/global';
import CommonSwitch from './CommonSwitch';

type Props = {
  value: boolean,
  currency: string,
  points: number,
  onChange: boolean => void,
};

const UsePointsSwitch = ({ value, onChange, currency, points }: Props) => (
  <CommonSwitch
    title="Usar puntos de lealtad"
    subtitle={`- ${currency} ${points}`}
    value={value}
    onChange={onChange}
  />
);

export default connect(
  (state: State) => ({
    currency: state.global.currency,
    points: (state.user && state.user.points) || 0,
    value: state.global.usePoints,
  }),
  {
    onChange: setUsePoints,
  },
)(visibleIf(UsePointsSwitch));
