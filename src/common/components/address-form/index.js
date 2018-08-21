// @flow
import React from 'react';
import {
  List,
  ListItem,
  Body,
  Text,
  Button,
} from 'native-base';
import { Form } from 'react-final-form';
import PlainForm from './plain';
import Visible from '../visible';
import type { Address } from '../../types';

type Props = {
  onSubmit: (Address) => void,
  values: Address,
  onDelete: () => void,
  onError: string => void,
  isLoading: boolean,
};

const AddressForm = ({
  onSubmit,
  values,
  onDelete,
  isLoading,
  onError,
}: Props) => (
  <Form
    onSubmit={onSubmit}
    initialValues={values}
    render={({ handleSubmit, pristine, invalid }) => (
      <List white>
        <ListItem>
          <PlainForm onError={onError} />
        </ListItem>
        <ListItem>
          <Body>
            <Button
              primary
              block
              onPress={handleSubmit}
              disabled={invalid || pristine || isLoading}
            >
              <Text>Guardar</Text>
            </Button>
          </Body>
        </ListItem>
        <Visible enabled={!!values}>
          <ListItem>
            <Body>
              <Button
                dark
                block
                onPress={onDelete}
                disabled={isLoading}
              >
                <Text>Eliminar</Text>
              </Button>
            </Body>
          </ListItem>
        </Visible>
      </List>
    )}
  />
);

export default AddressForm;
