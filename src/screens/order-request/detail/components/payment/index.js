// @flow

import * as React from 'react';
import { View, H2, H3, Text, List, ListItem, Left, Body } from 'native-base';
import type { CreditCard, PaymentMethod } from '../../../../../common/types';
import {getPaymentMethodText, mapCreditCardTypeAsIconName} from '../../../../../common/utils';
import Visible from '../../../../../common/components/visible';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
  paymentMethod: PaymentMethod,
  cashFor: number | string,
  creditCard: CreditCard,
};

const OrderRequestDetailPayment = ({
  paymentMethod,
  cashFor,
  creditCard,
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
  </List>
);

export default OrderRequestDetailPayment;
