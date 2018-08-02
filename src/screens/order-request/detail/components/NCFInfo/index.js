// @flow
import * as React from 'react';
import { View, ListItem, Text, Body } from 'native-base';
import type { NCFInfo as NCFType } from '../../../../../common/types';

type Props = {
  ncf: NCFType,
};

const NCFInfo = (props: Props) => (
  <View>
    <ListItem itemDivider>
      <Text>Detalle NCF:</Text>
    </ListItem>
    <ListItem>
      <Body>
        <Text note>Secuencia</Text>
        <Text>{props.ncf.seq}</Text>
      </Body>
    </ListItem>
    <ListItem>
      <Body>
        <Text note>Fecha Venc.</Text>
        <Text>{props.ncf.endDate.toLocaleDateString()}</Text>
      </Body>
    </ListItem>
    <ListItem>
      <Body>
        <Text note>Cédula\RNC</Text>
        <Text>{props.ncf.id}</Text>
      </Body>
    </ListItem>
    <ListItem>
      <Body>
        <Text note>Nombre Legal</Text>
        <Text>{props.ncf.name}</Text>
      </Body>
    </ListItem>
    <ListItem>
      <Body>
        <Text note>Nombre Comercial</Text>
        <Text>{props.ncf.commercialName}</Text>
      </Body>
    </ListItem>
  </View>
);

export default NCFInfo;
