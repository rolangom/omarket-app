// @flow
import * as React from 'react';
import { Field } from 'react-final-form';
import Visible from './visible';

type Props = {
  name: string,
  value?: any,
  children: React.Node<*>,
  inverse?: boolean,
  notEmpty?: boolean,
};

const VisibleIfFieldEq = ({ name, value, children, inverse, notEmpty }: Props) => (
  <Field
    name={name}
    subscription={{ value: true }}
    render={({ input: iinput }) => (
      <Visible enabled={
          inverse
            ? iinput !== value
            : notEmpty
            ? (iinput.value !== null && iinput.value !== undefined && iinput.value !== '')
            : iinput.value === value
        }
      >
        {children}
      </Visible>
    )}
  />
);

VisibleIfFieldEq.defaultProps = {
  value: '',
  inverse: false,
  notEmpty: false,
};

export default VisibleIfFieldEq;
