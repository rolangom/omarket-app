// @flow
import * as React from 'react';
import { Label, Input, Item, Form, View } from 'native-base';
import { Field } from 'react-final-form';
import { inputLocationRequired, inputRequired } from '../../utils';
import { lightGray } from '../../utils/constants';
import MapPlaceholder from '../MapPlaceholder';
import MapLocator from '../MapLocator';

type Props = {
  prefix?: ?string,
};

const PlainForm = ({ prefix }: Props) => (
  <Form>
    <Field
      name={`${prefix}location`}
      validate={inputLocationRequired}
      allowNull
      render={({ input, meta: { touched, error } }) => (
        <View>
          <MapPlaceholder location={input.value} />
          <MapLocator
            location={input.value}
            onChange={input.onChange}
            error={!!(touched && error)}
          />
        </View>
      )}
    />
    <Field
      name={`${prefix}name`}
      validate={inputRequired}
      render={({ input, meta: { touched, error } }) => (
        <Item stackedLabel error={touched && !!error}>
          <Label>Nombre</Label>
          <Input
            placeholder="Nombre, eg: Casa, Trabajo..."
            value={input.value}
            onChangeText={input.onChange}
            placeholderTextColor={lightGray}
          />
        </Item>
      )}
    />
    <Field
      name={`${prefix}descr`}
      validate={inputRequired}
      render={({ input, meta: { touched, error } }) => (
        <Item stackedLabel error={touched && !!error}>
          <Label>Descripción</Label>
          <Input
            placeholder="Calle, Casa o Edificio No. Apt., Sector, Ciudad"
            value={input.value}
            onChangeText={input.onChange}
            placeholderTextColor={lightGray}
          />
        </Item>
      )}
    />
    <Field
      name={`${prefix}extra`}
      render={({ input, meta: { touched, error } }) => (
        <Item stackedLabel error={touched && !!error}>
          <Label>Referencias</Label>
          <Input
            placeholder="Casi esquina..."
            value={input.value}
            onChangeText={input.onChange}
            placeholderTextColor={lightGray}
          />
        </Item>
      )}
    />
  </Form>
);

PlainForm.defaultProps = {
  prefix: '',
};

export default PlainForm;
