// @flow
import * as React from 'react';
import { withProps, flattenProp, compose } from 'recompose';
import { View, ListItem, Text, Body } from 'native-base';
import type { NCFInfo as NCF } from 'src/common/types';
import { tsToDateStr } from 'src/common/utils';

type Props = NCF;

const NCFInfo = (props: Props) => (
  <View>
    <ListItem itemDivider>
      <Text>Detalle NCF:</Text>
    </ListItem>
    <ListItem>
      <Body>
        <Text note>Secuencia</Text>
        <Text>{props.seq}</Text>
      </Body>
    </ListItem>
    <ListItem>
      <Body>
        <Text note>Fecha Venc.</Text>
        <Text>{props.endDate}</Text>
      </Body>
    </ListItem>
    <ListItem>
      <Body>
        <Text note>Cédula\RNC</Text>
        <Text>{props.id}</Text>
      </Body>
    </ListItem>
    <ListItem>
      <Body>
        <Text note>Nombre Legal</Text>
        <Text>{props.name}</Text>
      </Body>
    </ListItem>
    <ListItem>
      <Body>
        <Text note>Nombre Comercial</Text>
        <Text>{props.commercialName}</Text>
      </Body>
    </ListItem>
  </View>
);

const enhance = compose(
  flattenProp('ncf'),
  withProps(
    (props: Props): Props => ({
      endDate: tsToDateStr(props.endDate),
    }),
  ),
);

export default enhance(NCFInfo);
