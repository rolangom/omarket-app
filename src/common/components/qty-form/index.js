// @flow
import React from 'react';
import {
  branch,
  renderComponent,
  compose,
  defaultProps,
} from 'recompose';
import QtyInput from '../qty-input';
import type { CartItem } from '../../types';
import AddProduct from '../AddProduct';

export type Props = {
  flex?: ?boolean,
  cartItem: CartItem,
  productID: string,
  offerID?: ?string,
  defaultValue?: number,
  max?: number,
  value: number,
  onChange: number => void,
};

const enhance = compose(
  defaultProps({ defaultValue: 0, max: 100, flex: false }),
  branch((props: Props) => props.value === 0, renderComponent(AddProduct)),
);

export default enhance(QtyInput);
