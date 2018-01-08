// @flow
import * as React from 'react';
import { Field } from 'react-final-form';
import Visible from './visible';

type Props = {
  name: string,
  value: any,
  children: React.Node<*>,
}

const VisibleIfFieldEq = ({ name, value, children }: Props) => (
  <Field
    name={name}
    subscription={{ value: true }}
    render={({ input: iinput }) => (
      <Visible enabled={iinput.value === value}>
        {children}
      </Visible>
    )}
  />
);

export default VisibleIfFieldEq;
