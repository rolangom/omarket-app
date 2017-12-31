/*
@flow
*/

import * as React from 'react';
import { withNavigation } from 'react-navigation';

type Props = {
  to: string,
  component: React.ComponentType<any>,
  navigation: Object,
  params: Object
};

class Link extends React.Component<Props> {
  onPress = () => this.props.navigation.navigate(this.props.to, this.props.params);
  render(): React.Node {
    const {
      to,
      component: Component,
      ...args
    } = this.props;
    return (
      <Component
        onPress={this.onPress}
        {...args}
      />
    );
  }
}

export default withNavigation(Link);
