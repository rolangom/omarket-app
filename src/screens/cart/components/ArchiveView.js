// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Button, View, Text, Icon } from 'native-base';
import Prompt from '../../../libs/react-native-prompt';
import { postCurrentCart } from '../../../ducks/savedCarts';
import Visible from '../../../common/components/visible';

type Props = {
  disabled?: boolean,
  onSubmit: (name: string) => void,
};
type State = {
  isPromptVisible: boolean,
};

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (name: string) =>
    dispatch(postCurrentCart(name)),
});

@connect(null, mapDispatchToProps)
export default class ArchiveView extends React.Component<Props, State> {
  state = { isPromptVisible: false };
  onTogglePromptVisible = () =>
    this.setState(state => ({ isPromptVisible: !state.isPromptVisible }));
  onPress = () => this.onTogglePromptVisible();
  onHidePrompt = () => this.onTogglePromptVisible();
  onSubmitPrompt = (name: string) => {
    this.props.onSubmit(name);
    this.onTogglePromptVisible();
  };
  render() {
    return (
      <Visible enabled={!this.props.disabled}>
        <View>
          <Button primary full iconLeft onPress={this.onPress}>
            <Icon name="ios-archive" />
            <Text>Guardar para luego</Text>
          </Button>
          <Prompt
            title="Nombre de Lista"
            visible={this.state.isPromptVisible}
            onCancel={this.onHidePrompt}
            onSubmit={this.onSubmitPrompt}
          />
        </View>
      </Visible>
    );
  }
}

