// @flow
import * as React from 'react';
import { branch, renderNothing } from 'recompose';

type Props = {
  visible: boolean,
  component: React.Node<*>,
};

const Maybe = ({ component: Component, ...args }: Props) => (
  <Component {...args} />
);

const enhance =
  branch(
    (props: Props) => !props.visible,
    renderNothing,
  );

export default enhance(Maybe);
