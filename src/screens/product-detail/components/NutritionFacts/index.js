// @flow
import * as React from 'react';
import { StyleSheet, Platform, Text, View } from 'react-native';


const styles = StyleSheet.create({
  main: {
    backgroundColor: 'white',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingVertical: 2,
  },
  flex1: {
    flex: 1,
  },
  thinLine: {
    height: 5,
    backgroundColor: 'black',
  },
  fatLine: {
    height: 3,
    backgroundColor: 'black',
  },
  header: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    color: 'black',
    ...Platform.select({
      ios: {
        fontFamily: 'Courier New',
      },
      android: {
        fontFamily: 'monospace',
      },
    }),
  },
});

type Props = {
  text: string,
};

const emptyStr = '';
const boldFix = '**';

const renderText = (text: string) => {
  const i1 = text.indexOf(boldFix);
  const i2 = text.lastIndexOf(boldFix);
  return (
    <Text style={styles.text}>
      {i1 >= 0 ? text.slice(0, i1): emptyStr}
      {i1 >= 0
        ? (
          <Text style={styles.bold}>
            {text.slice(
              i1 + boldFix.length,
              (i2 === i1 || i2 === -1)
                ? undefined : i2
            )}
          </Text>
        )
        : text}
      {i1 >= 0 && i2 > i1 ? text.slice(i2 + boldFix.length): emptyStr}
    </Text>
  )
};

const renderCol = (col: string, i: number) => (
  <View key={col+i}>
    {renderText(col)}
    {/*<Text style={styles.text}>{col}</Text>*/}
  </View>
);

const renderColumns = (cols: string[]) => (
  <View style={styles.row}>
    {cols.map(renderCol)}
  </View>
);

const renderLine = (row: string, i: number) => {
  const cols = row.split(';');
  switch (true) {
    case cols[0] === '--':
      return <View key={`--${i}`} style={styles.fatLine} />;
    case cols[0] === '-':
      return <View key={`-${i}`} style={styles.thinLine} />;
    default:
      return renderColumns(cols);
  }
};

const NutritionFacts = ({ text }: Props) => (
  <View style={styles.main}>
    <Text style={styles.header}>Valor Nutricional</Text>
    {text.split('\n').map(renderLine)}
  </View>
);

export default NutritionFacts;
