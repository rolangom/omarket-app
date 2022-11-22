// @flow
import * as React from 'react';
import { Text } from 'native-base';
import { branch, renderNothing, flattenProp, compose } from 'recompose';
import type { Offer } from 'src/common/types';

type Props = {
  offer?: Offer,
  beginDate?: Date,
  endDate?: Date,
  style?: Object,
};

const OfferDetailText = (props: Props) => (
  <Text style={props.style}>
    Oferta válida: {props.beginDate.toLocaleDateString()} -{' '}
    {props.endDate.toLocaleDateString()}
  </Text>
);

const enhance = compose(
  branch((props: Props) => !props.offer, renderNothing),
  flattenProp('offer'),
);

export default enhance(OfferDetailText);
