// @flow
import * as React from 'react';
import { View, Switch } from 'react-native';
import { Field } from 'react-final-form';
import {
  Button,
  Item,
  Icon,
  Label,
  ListItem,
  Body,
  Text,
  Input,
} from 'native-base';
import Link from '../../../common/components/link';
import DropDown from '../../../common/components/drop-down';

import { darkGray, lightGray } from '../../../common/utils/constants';
import { inputRequired } from '../../../common/utils';
import VisibleIfFieldEq from '../../../common/components/visible-if-field-eq';
import PlainAddressForm from '../../../common/components/address-form/plain';

const styles = {
  addButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
};

type ItemProps = {
  label: string,
  value: string,
};

type Props = {
  addresses: ItemProps[],
  creditCards: ItemProps[],
  paymentMethods: ItemProps[],
};

const OrderRequestForm = ({ addresses, creditCards, paymentMethods }: Props) => (
  <View>
    <Field
      name="addressID"
      render={({ input, meta: { touched, error } }) => (
        <Item
          stackedLabel
          error={touched && !!error}
        >
          <Link
            component={Button}
            to="AddressEditor"
            dark
            small
            style={styles.addButton}
          >
            <Icon
              name="md-add"
              color="white"
              size={22}
            />
          </Link>
          <Label>Enviar a una dirección favorita</Label>
          <DropDown
            placeholder="Seleccione"
            options={addresses}
            selectedValue={input.value}
            onChange={input.onChange}
          />
        </Item>
      )}
    />

    <VisibleIfFieldEq
      name="addressID"
      value=""
    >
      <PlainAddressForm prefix="address." />
      <Field
        name="saveAddress"
        render={({ input }) => (
          <ListItem>
            <Switch
              value={!!input.value}
              onValueChange={input.onChange}
              onTintColor={lightGray}
              thumbTintColor={darkGray}
            />
            <Body>
              <Text>Guardar dirección</Text>
            </Body>
          </ListItem>
        )}
      />
    </VisibleIfFieldEq>
    <Field
      name="paymentMethod"
      validate={inputRequired}
      render={({ input, meta: { touched, error } }) => (
        <Item
          stackedLabel
          error={touched && !!error}
        >
          <Label>Método de pago</Label>
          <DropDown
            placeholder="Seleccione"
            options={paymentMethods}
            selectedValue={input.value}
            onChange={input.onChange}
          />
        </Item>
      )}
    />

    <VisibleIfFieldEq
      name="paymentMethod"
      value="cash"
    >
      <Field
        name="cashFor"
        validate={inputRequired}
        render={({ input, meta }) => (
          <Item
            stackedLabel
          >
            <Label>Necesitas Cambio?</Label>
            <Input
              placeholder="Para cuánto?"
              placeholderTextColor={lightGray}
              value={input.value}
              onChangeText={input.onChange}
              keyboardType="numeric"
            />
          </Item>
        )}
      />
    </VisibleIfFieldEq>

    <VisibleIfFieldEq
      name="paymentMethod"
      value="credit-card"
    >
      <Field
        name="creditCardID"
        validate={inputRequired}
        render={({ input, meta }) => (
          <Item
            stackedLabel
          >
            <Label>Tarjeta de crédito</Label>
            <DropDown
              placeholder="Seleccione"
              options={creditCards}
              selectedValue={input.value}
              onChange={input.onChange}
            />
          </Item>
        )}
      />
    </VisibleIfFieldEq>
  </View>
);

export default OrderRequestForm;
