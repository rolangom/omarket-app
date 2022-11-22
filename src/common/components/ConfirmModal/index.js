// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import type { ConfirmConfig, State } from '../../types';
import { hideConfirm } from '../../../ducks/global';

type Props = ConfirmConfig | {
  onAccept: () => void,
  onCancel: () => void,
};

class ConfirmModal extends React.Component<Props> {
  render() {
    const {
      visible,
      title,
      message,
      acceptButtonText,
      cancelButtonText,
      onAccept,
      onCancel,
    } = this.props;
    return (
      <ConfirmDialog
        title={title}
        message={message}
        visible={visible}
        positiveButton={{
          title: acceptButtonText,
          onPress: onAccept,
        }}
        negativeButton={{
          title: cancelButtonText,
          onPress: onCancel,
        }}
      />
    );
  }
}

const mapStateToProps = (state: State) => {
  const { confirmModal } = state.global;
  return confirmModal;
};
const mapDispatchToProps = dispatch => ({
  onAction: (type: string, payload: any) => {
    dispatch(hideConfirm());
    dispatch({ type, payload, error: false });
  },
});

const mergeProps = (stateProps: ConfirmConfig, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onAccept: () => dispatchProps.onAction(stateProps.acceptActionType, stateProps.acceptPayload),
  onCancel: () => dispatchProps.onAction(stateProps.cancelActionType),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ConfirmModal);
