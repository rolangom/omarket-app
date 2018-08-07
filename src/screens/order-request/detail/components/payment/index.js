// @flow

import * as React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { View, H2, H3, Text, List, ListItem, Left, Body } from 'native-base';
import type { CreditCard, PaymentMethod, NCFInfo as NCFType } from '../../../../../common/types';
import {
  getPaymentMethodText,
  mapCreditCardTypeAsIconName,
} from '../../../../../common/utils';
import NCFInfo from '../NCFInfo';
import Visible from '../../../../../common/components/visible';

type Props = {
  paymentMethod: PaymentMethod,
  cashFor: number | string,
  creditCard: CreditCard,
  ncf: NCFType,
  points: number,
};

const OrderRequestDetailPayment = ({
  paymentMethod,
  cashFor,
  creditCard,
  ncf,
  points,
}: Props) => (
  <List>
    <ListItem itemDivider first>
      <Text>Detalle de pago:</Text>
    </ListItem>
    <ListItem>
      <Body>
        <Text note>Método</Text>
        <Text>{getPaymentMethodText(paymentMethod)}</Text>
      </Body>
    </ListItem>
    <Visible enabled={paymentMethod === 'cash'}>
      <ListItem>
        <Body>
          <Text note>Devuelta para</Text>
          <Text>{cashFor}</Text>
        </Body>
      </ListItem>
    </Visible>
    <Visible enabled={points > 0}>
      <ListItem>
        <Body>
          <Text note>Puntos de lealtad canjeados</Text>
          <Text>{points}</Text>
        </Body>
      </ListItem>
    </Visible>
    <Visible enabled={paymentMethod === 'credit-card'}>
      <ListItem icon>
        <Left>
          <FontAwesome
            size={28}
            name={mapCreditCardTypeAsIconName(creditCard.type)}
          />
        </Left>
        <Body>
          <Text note>Tarjeta de crédito</Text>
          <Text>{creditCard.number}</Text>
        </Body>
      </ListItem>
    </Visible>
    <Visible enabled={!!ncf}>
      <NCFInfo ncf={ncf} />
    </Visible>
  </List>
);

export default OrderRequestDetailPayment;
