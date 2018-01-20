// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Content,
} from 'native-base';
// import { Map } from 'expo';
import type { Address, State } from '../../../common/types';
import { requestDeleteAddress, postAddress as postAddressAction } from '../../../ducks/addresses/index';
import UserContent from '../../../common/components/user-content/index';
import Form from '../../../common/components/address-form/index';

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
            <Form
              onSubmit={postAddress}
              values={address}
              isLoading={isLoading}
              onDelete={onDelete}
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
