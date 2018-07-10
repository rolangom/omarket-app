// @flow
import * as React from 'react';
import { ListItem, Text, Body, Right, Icon } from 'native-base';

import Link from '../../../../common/components/link';
import type { Cart } from '../../../../common/types';
import { lightGray } from '../../../../common/utils/constants';

type Props = Cart;

const styles = {
  icon: {
    fontSize: 24,
    color: lightGray,
  },
};

const CartListItem = (props: Props) => (
  <Link
    component={ListItem}
    button
    to="SavedCartDetail"
    params={{ cartID: props.id }}
  >
    <Body>
      <Text>{props.name}</Text>
      <Text note>{props.createdAt && new Date(props.createdAt).toLocaleString('es-DO')}</Text>
    </Body>
    <Right>
      <Icon name="ios-arrow-forward" style={styles.icon} />
    </Right>
  </Link>
);

export default CartListItem;
