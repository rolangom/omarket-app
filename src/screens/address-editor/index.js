// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  List,
  ListItem,
  Body,
  Input,
  Button,
  Text,
  Textarea,
} from 'native-base';
import { Form as FinalForm, Field } from 'react-final-form';
// import { Map } from 'expo';
import type { Address, State } from '../../common/types';
import { inputRequired } from '../../common/utils';
import { requestDeleteAddress, postAddress as postAddressAction } from '../../ducks/addresses';
import UserContent from '../../common/components/user-content';

type Props = {
  isLoading: boolean;
  postAddress: (Address) => void,
  onDelete: () => void,
  address?: Address,
};

class AddressEditor extends React.Component<Props> {
  render() {
    const {
      isLoading,
      postAddress,
      onDelete,
      address,
    } = this.props;
    return (
      <Container>
        <Content padder>
          <UserContent>
            <FinalForm
              onSubmit={postAddress}
              initialValues={address}
              render={({ handleSubmit, pristine, invalid }) => (
                <List white>
                  <Field
                    name="name"
                    validate={inputRequired}
                    render={({ input, meta }) => (
                      <ListItem>
                        <Body>
                          <Input
                            placeholder="Nombre, eg: Casa, Trabajo..."
                            value={input.value}
                            onChangeText={input.onChange}
                          />
                          <Text note>Nombre</Text>
                        </Body>
                      </ListItem>
                    )}
                  />
                  <Field
                    name="descr"
                    validate={inputRequired}
                    render={({ input, meta }) => (
                      <ListItem>
                        <Body>
                          <Textarea
                            placeholder="Calle, Casa o Edificio No. Apt., Sector, Ciudad"
                            value={input.value}
                            onChangeText={input.onChange}
                          />
                          <Text note>Descripción</Text>
                        </Body>
                      </ListItem>
                    )}
                  />
                  <Field
                    name="extra"
                    render={({ input, meta }) => (
                      <ListItem error={meta.error}>
                        <Body>
                          <Textarea
                            placeholder="Casi esquina ..."
                            value={input.value}
                            onChangeText={input.onChange}
                          />
                          <Text note>Referencias</Text>
                        </Body>
                      </ListItem>
                    )}
                  />
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
                  <ListItem>
                    <Body>
                      {address &&
                        <Button
                          dark
                          block
                          onPress={onDelete}
                          disabled={isLoading}
                        >
                          <Text>Eliminar</Text>
                        </Button>
                      }
                    </Body>
                  </ListItem>
                </List>
              )}
            />
          </UserContent>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: State, ownProps) => {
  const id: string = ownProps.navigation
    && ownProps.navigation.state.params
    && ownProps.navigation.state.params.id;
  return {
    isLoading: state.global.isLoading,
    address: id && state.addresses.byId[id],
  };
};
const mapDispatchToProps = (dispatch) => ({
  postAddress: (address: Address) => dispatch(postAddressAction(address)),
  onDelete: (id: string) => dispatch(requestDeleteAddress(id)),
});
const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onDelete: () => dispatchProps.onDelete(stateProps.address.id),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AddressEditor);
