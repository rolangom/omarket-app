// @flow
/* eslint no-confusing-arrow: "error" */
import * as React from 'react';

type Props = {
  enabled: boolean,
  children: React.Node<*>
};

// const Visible = ({ enabled, children }: Props) => enabled ? children : null;
class Visible extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return this.props.enabled !== nextProps.enabled;
  }
  render() {
    return this.props.enabled ? this.props.children : null;
  }
}

export default Visible;
