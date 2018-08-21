// @flow
import * as React from 'react';
import { ListItem, Text, Body, Right, Icon } from 'native-base';

import Link from '../../../../common/components/link';
import type { OrderRequest } from '../../../../common/types';
import { lightGray } from '../../../../common/utils/constants';
import { getOrderStatusText, tsToDateStr } from '../../../../common/utils';

type Props = OrderRequest;

const styles = {
  icon: {
    fontSize: 24,
    color: lightGray,
  },
};

const OrderListItem = (props: Props) => (
  <Link
    component={ListItem}
    button
    to="OrdersRequestDetail"
    params={{ orderRequestID: props.id }}
  >
    <Body>
      <Text>
        {tsToDateStr(props.createdAt)}
      </Text>
      <Text note>{getOrderStatusText(props.status)}</Text>
    </Body>
    <Right>
      <Icon name="ios-arrow-forward" style={styles.icon} />
    </Right>
  </Link>
);

export default OrderListItem;
