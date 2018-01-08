// @flow
import * as React from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { darkGray } from '../../utils/constants';
import Chevron from '../chevron';
import Visible from '../visible';

const styles = {
  optionView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingLeft: 0,
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  text: {
    fontSize: 17,
    color: darkGray,
  },
};

const CheckmarkView = () => (
  <Ionicons
    name="md-checkmark"
    size={24}
    color={darkGray}
  />
);

type OptionProps = {
  label: string,
  value: any,
  checked?: boolean,
  onClick?: (any) => void,
};

class Option extends React.Component<OptionProps> {
  onPress = () => this.props.onClick && this.props.onClick(this.props.value);
  render() {
    const {
      label,
      checked,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={this.onPress}
      >
        <View style={styles.optionView}>
          <Text style={styles.text}>{label}</Text>
          <Visible enabled={checked}>
            <CheckmarkView />
          </Visible>
        </View>
      </TouchableOpacity>
    );
  }
}

type HeadProps = {
  isOpen: boolean,
  onClick: () => void,
  options: OptionProps[],
  selectedValue: any,
  placeholder?: string,
};

class Head extends React.Component<HeadProps> {
  render() {
    const {
      options,
      placeholder,
      selectedValue,
    } = this.props;
    const selected: OptionProps = options.find((it: OptionProps) => it.value === selectedValue);
    return (
      <TouchableOpacity
        onPress={this.props.onClick}
      >
        <View style={styles.optionView}>
          <Text style={styles.text}>
            {(selected && selected.value)
              ? selected.label
              : placeholder
            }
          </Text>
          <Chevron isUp={this.props.isOpen} />
        </View>
      </TouchableOpacity>
    );
  }
}

type Props = {
  options?: OptionProps[],
  name?: string,
  selectedValue: any,
  children: React.Node<*>,
  placeholder: string,
  onChange: (any) => void,
};

type State = {
  isOpen: boolean,
}

class DropDown extends React.Component<Props, State> {
  state = { isOpen: false };
  onToggleVisible = () => this.setState((state: State) => ({ isOpen: !state.isOpen }));
  onChange = (value: any) => {
    const { onChange } = this.props;
    this.onToggleVisible();
    onChange(value);
  };
  keyExtractor = (it: OptionProps) => it.value;
  renderItem = ({ item }) => {
    const { selectedValue } = this.props;
    const checked = selectedValue === item.value;
    return (
      <Option
        label={item.label}
        value={item.value}
        checked={checked}
        onClick={this.onChange}
      />
    );
  };
  render() {
    const {
      options,
      selectedValue,
      children,
      placeholder,
    } = this.props;
    const { isOpen } = this.state;
    return (
      <View style={styles.container}>
        <Head
          isOpen={isOpen}
          selectedValue={selectedValue}
          onClick={this.onToggleVisible}
          placeholder={placeholder}
          options={options}
        />
        <Visible enabled={isOpen}>
          <FlatList
            data={options}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
          {children}
        </Visible>
      </View>
    );
  }
}

DropDown.defaultProps = {
  options: [],
  closeOnChange: true,
};

export default DropDown;
