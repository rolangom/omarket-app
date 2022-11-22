// @flow
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem, Text, Body, Right, Icon } from 'native-base';

import Link from 'src/common/components/link';
import type { OrderRequest } from 'src/common/types';
import { lightGray } from 'src/common/utils/constants';
import { getOrderStatusText, tsToDateStr } from 'src/common/utils';

type Props = OrderRequest;

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
    color: lightGray,
  },
});

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
