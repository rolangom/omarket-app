// @flow
import React from 'react';
import { Button, Text, View } from 'native-base';
import QtyInput from './qty-input';
import { lighterGray } from '../../config/constants';

export type Props = {
  defaultValue?: number,
  max?: number,
  onSubmit: (number) => void,
};

type State = {
  value: number,
};

const styles = {
  main: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: lighterGray,
  },
  button: {
    flex: 1,
  },
};

class QtyForm extends React.Component<Props, State> {
  state = {
    value: this.props.defaultValue,
  };
  onChange = (value: number) => this.setState({ value });
  onSubmit = () => this.props.onSubmit(this.state.value);
  render() {
    const { value } = this.state;
    const { max } = this.props;
    return (
      <View style={styles.main}>
        <QtyInput
          value={value}
          onChange={this.onChange}
          max={max}
        />
        <Button
          primary
          flex1
          onPress={this.onSubmit}
        >
          <Text>Ordenar</Text>
        </Button>
      </View>
    );
  }
}

QtyForm.defaultProps = {
  defaultValue: 0,
  max: 100,
};

export default QtyForm;
