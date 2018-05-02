// @flow
import * as React from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { darkGray, gray, lighterGray } from '../../utils/constants';
import Chevron from '../chevron';
import Visible from '../visible';

const styles = {
  optionView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingLeft: 0,
    borderBottomColor: lighterGray,
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 17,
    color: gray,
    textAlign: 'center',
  },
  text: {
    fontSize: 17,
    color: darkGray,
  },
  errorText: {
    color: 'red',
  },
};

const CheckmarkView = () => (
  <Ionicons name="md-checkmark" size={24} color={darkGray} />
);

type OptionProps = {
  label: string,
  value: any,
  checked?: boolean,
  onClick?: any => void,
};

class Option extends React.Component<OptionProps> {
  onPress = () => this.props.onClick && this.props.onClick(this.props.value);
  render() {
    const { label, checked } = this.props;
    return (
      <TouchableOpacity onPress={this.onPress}>
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
  leftIcon?: string,
};

class Head extends React.Component<HeadProps> {
  render() {
    const { options, placeholder, selectedValue, leftIcon } = this.props;
    const selected: OptionProps = options.find(
      (it: OptionProps) => it.value === selectedValue,
    );
    return (
      <TouchableOpacity onPress={this.props.onClick}>
        <View style={styles.optionView}>
          {leftIcon && <Ionicons name={leftIcon} size={24} color={darkGray} />}
          <Text style={styles.text}>
            {selected && selected.value ? selected.label : placeholder}
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
  label?: string,
  defaultOpen: boolean,
  selectedValue: ?any,
  children: React.Node<*>,
  placeholder: string,
  onChange: any => void,
  error?: string,
  leftIcon?: string,
  closeOnChange: boolean,
};

type State = {
  isOpen: boolean,
};

class DropDown extends React.Component<Props, State> {
  state = { isOpen: this.props.defaultOpen };
  onToggleVisible = () =>
    this.setState((state: State) => ({ isOpen: !state.isOpen }));
  onChange = (value: any) => {
    const { onChange } = this.props;
    this.props.closeOnChange && this.onToggleVisible();
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
      label,
      options,
      selectedValue,
      children,
      placeholder,
      error,
      leftIcon,
    } = this.props;
    const { isOpen } = this.state;
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <Head
          isOpen={isOpen}
          selectedValue={selectedValue}
          onClick={this.onToggleVisible}
          placeholder={placeholder}
          options={options}
          leftIcon={leftIcon}
        />
        <Visible enabled={isOpen}>
          <FlatList
            data={options}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
          {children}
        </Visible>
        <Visible enabled={!!error}>
          <Text style={styles.errorText}>{error}</Text>
        </Visible>
      </View>
    );
  }
}

DropDown.defaultProps = {
  options: [],
  defaultOpen: false,
  closeOnChange: true,
};

export default DropDown;
