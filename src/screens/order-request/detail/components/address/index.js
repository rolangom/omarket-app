// @flow

import * as React from 'react';
import { H2, H3, Text, View, List, ListItem, Body } from 'native-base';
import type { Address } from '../../../../../common/types';

type Props = {
  address: Address,
};

const styles = {
  container: {
    padding: 10,
  },
  item: {
    paddingVertical: 5,
  },
};

const AddressDetail = ({ address }: Props) => (
  <List>
    <ListItem itemDivider first>
      <Text>A entregar en la dirección:</Text>
    </ListItem>
    <ListItem>
      <Body>
        <Text note>Nombre</Text>
        <Text>{address.name}</Text>
      </Body>
    </ListItem>
    <ListItem>
      <Body>
        <Text note>Descripción</Text>
        <Text>{address.descr}</Text>
      </Body>
    </ListItem>
    <ListItem>
      <Body>
        <Text note>Referencias</Text>
        <Text>{address.extra}</Text>
      </Body>
    </ListItem>
    <ListItem itemDivider last>
      <Text> - </Text>
    </ListItem>
  </List>
);

export default AddressDetail;
