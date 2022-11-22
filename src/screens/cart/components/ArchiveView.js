// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Button, View, Text, Icon } from 'native-base';
import Prompt from '../../../libs/react-native-prompt';
import { postCurrentCart } from '../../../ducks/savedCarts';
import Visible from '../../../common/components/visible';
import { row, paddingM } from 'src/common/utils/styles';

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
        <View style={[row, paddingM]}>
          <Button
            light
            flex1
            onPress={this.onPress}
          >
            <Text>Guardar lista</Text>
          </Button>
          <Button
            transparent
            flex1
          >
            <Text />
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

