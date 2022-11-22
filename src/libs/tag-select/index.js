// @flow
import * as React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { compose, defaultProps, withHandlers, onlyUpdateForKeys } from 'recompose';

const styles = StyleSheet.create({
  item: {
    // flex: 1,
    padding: 5,
    paddingHorizontal: 7,
    margin: 2,
    borderRadius: 3,
  },
  itemText: {
    textAlign: 'center',
    fontSize: 12,
  },
  checked: {
    backgroundColor: '#aaaaaa',
  },
  main: {
    paddingTop: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});

type ItemProp = {
  key: number|string,
  label: string,
  checked: boolean,
  checkedBgColor: string,
  defaultBgColor: string,
  onPress(): void,
};

const TagItem = (props: ItemProp) => (
  <TouchableOpacity
    style={[
      styles.item,
      { backgroundColor: props.checked ? props.checkedBgColor : props.defaultBgColor },
    ]}
    onPress={props.onPress}
  >
    <Text style={styles.itemText}>{props.label}</Text>
  </TouchableOpacity>
);

type Option = {
  key: string|number,
  label: string,
};

type Props = {
  items: Option[],
  single: boolean,
  value: Array<string|number>,
  keyAttr: string,
  labelAttr: string,
  checkedBgColor: string,
  defaultBgColor: string,
  onChange(Array<string|number>): void,
  renderItem(item: Option, i: number): void,
};

const TagSelect = (props: Props) => (
  <View style={styles.main}>
    {props.items.map(props.renderItem)}
  </View>
);

const enhance = compose(
  defaultProps({
    keyAttr: 'key', labelAttr: 'label',
    value: null, items: [], single: false,
    checkedBgColor: '#FF0000', defaultBgColor: '#DDD',
  }),
  onlyUpdateForKeys(['value', 'items']),
  withHandlers({
    renderItem: (props: Props) => (item: Option) => {
      const {
        value = [],
        keyAttr, labelAttr,
        onChange,
        checkedBgColor, defaultBgColor,
        single,
      } = props;
      const checked: boolean = single
        ? value === item[keyAttr]
        : value.includes(item[keyAttr]);
      const onPress = () => {
        const newValue = single
          ? (checked ? null : item[keyAttr])
          : (checked
            ? value.filter((it: string|number) => it !== item[keyAttr])
            : [item[keyAttr]].concat(value));
        onChange(newValue);
      };

      return (
        <TagItem
          key={item[keyAttr]}
          label={item[labelAttr]}
          checked={checked}
          onPress={onPress}
          checkedBgColor={checkedBgColor}
          defaultBgColor={defaultBgColor}
        />
      );
    }
  })
);

export default enhance(TagSelect);
