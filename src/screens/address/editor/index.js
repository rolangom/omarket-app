// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Container, Content } from 'native-base';
import type { Address, State } from '../../../common/types';
import {
  requestDeleteAddress,
  postAddress,
} from '../../../ducks/addresses/index';
import UserContent from '../../../common/components/user-content/index';
import Form from '../../../common/components/address-form/index';
import { addError } from '../../../ducks/global';

type Props = {
  isLoading: boolean,
  onSubmit: Address => void,
  onDelete: () => void,
  address?: Address,
  onError: string => void,
};

class AddressEditor extends React.Component<Props> {
  render() {
    const {
      isLoading,
      address,
      onSubmit,
      onDelete,
      onError,
    } = this.props;
    return (
      <Container>
        <Content padder>
          <UserContent>
            <Form
              values={address}
              isLoading={isLoading}
              onSubmit={onSubmit}
              onDelete={onDelete}
              onError={onError}
            />
          </UserContent>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: State, ownProps) => {
  const id: string =
    ownProps.navigation &&
    ownProps.navigation.state.params &&
    ownProps.navigation.state.params.id;
  return {
    isLoading: state.global.isLoading,
    address: id && state.addresses.byId[id],
  };
};
const mapDispatchToProps = {
  onSubmit: postAddress,
  onDelete: requestDeleteAddress,
  onError: addError,
};
const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onDelete: () => dispatchProps.onDelete(stateProps.address.id),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  AddressEditor,
);
