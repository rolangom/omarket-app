// @flow
import * as React from 'react';

type Props = {
  condition: boolean,
  children: () => React.Node<*>,
}

const ShowIf = ({ condition, children }: Props) => (
  condition
    ? children()
    : null
);

export default ShowIf;
