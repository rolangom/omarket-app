// @flow
import * as React from 'react';
import { View, Switch } from 'react-native';
import { Field } from 'react-final-form';
import { LiteCreditCardInput } from 'react-native-credit-card-input';
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
import Link from '../../../../common/components/link/index';
import DropDown from '../../../../common/components/drop-down/index';

import { darkGray, lightGray } from '../../../../common/utils/constants';
import {
  inputCVCValidate,
  inputIsPropValid,
  inputRequired,
  parseCreditCardFormValue,
} from '../../../../common/utils/index';
import VisibleIfFieldEq from '../../../../common/components/visible-if-field-eq';
import PlainAddressForm from '../../../../common/components/address-form/plain';
import Visible from "../../../../common/components/visible/index";

const styles = {
  addButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  row: {
    flexDirection: 'row',
  },
  flex3: {
    flex: 3,
  },
  flex1: {
    flex: 0.3125,
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

const OrderRequestForm = ({
  addresses,
  creditCards,
  paymentMethods,
}: Props) => (
  <View>
    <Field
      name="addressID"
      render={({ input, meta: { touched, error } }) => (
        <Item stackedLabel error={touched && !!error}>
          <Link
            component={Button}
            to="AddressEditor"
            dark
            small
            style={styles.addButton}
          >
            <Icon name="md-add" color="white" size={22} />
          </Link>
          <Label>Enviar a una dirección favorita</Label>
          <DropDown
            placeholder="Seleccione o ingrese"
            options={addresses}
            selectedValue={input.value}
            onChange={input.onChange}
          />
        </Item>
      )}
    />

    <VisibleIfFieldEq name="addressID" value="">
      <PlainAddressForm prefix="address." />
      <Field
        name="doSaveAddress"
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
        <Item stackedLabel error={touched && !!error}>
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

    <VisibleIfFieldEq name="paymentMethod" value="cash">
      <Field
        name="cashFor"
        validate={inputRequired}
        render={({ input, meta }) => (
          <Item stackedLabel>
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

    <VisibleIfFieldEq name="paymentMethod" value="credit-card">
      <Field
        name="creditCardID"
        render={({ input, meta }) => (
          <Item stackedLabel>
            <Label>Tarjeta de crédito</Label>
            <View style={styles.row}>
              <DropDown
                placeholder="Seleccione o ingrese"
                options={creditCards}
                selectedValue={input.value}
                onChange={input.onChange}
              />
              <Visible enabled={input.value !== ''}>
                <Field
                  name="cvc"
                  validate={inputCVCValidate}
                  render={({ input: _input, meta }) => (
                    <Input
                      style={styles.flex1}
                      placeholder="cvc/cvv"
                      value={_input.value}
                      keyboardType="numeric"
                      maxLength={4}
                      onChangeText={_input.onChange}
                    />
                  )}
                />
              </Visible>
            </View>
          </Item>
        )}
      />

      <VisibleIfFieldEq name="creditCardID" value="">
        <Field
          name="creditCard"
          validate={inputIsPropValid}
          // parse={parseCreditCardFormValue}
          render={({ input, meta }) => (
            <Item>
              <LiteCreditCardInput onChange={input.onChange} />
            </Item>
          )}
        />
      </VisibleIfFieldEq>
    </VisibleIfFieldEq>
  </View>
);

export default OrderRequestForm;
