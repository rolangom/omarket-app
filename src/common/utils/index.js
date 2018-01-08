// @flow

import { currency } from './constants';
import type { CreditCard } from '../types';

export function getDocs(querySnapshot) {
  return querySnapshot && querySnapshot.docs ?
    querySnapshot
      .docs
      .map(it => ({ id: it.id, ...it.data() }))
    :
    [];
}

export function getRealtDocs(snapshot) {
  const data = [];
  snapshot
    .forEach(docSnapshot => data.push({ id: docSnapshot.key, ...docSnapshot.val() }));
  return data;
}

export const getDocsAsDict = querySnapshot =>
  querySnapshot
    .docs
    .reduce((acc, it) => {
      acc[it.id] = { id: it.id, ...it.data() };
      return acc;
    }, {});

const sortFnAsc = (attr: string) => (a, b) => (a[attr] || 100) - (b[attr] || 100);
const sortFnDesc = (attr: string) => (a, b) => (b[attr] || 100) - (a[attr] || 100);

export const sortBy = (data: Array<any>, attr: string, asc: boolean = true) =>
  data
    .sort((asc ? sortFnAsc : sortFnDesc)(attr));

export const getPriceWithCurrency = (price: number, pCurrency: string = currency) =>
  `${pCurrency} ${price || 0}`;

export function padStart(num: number, places: number, char: string = '0') {
  const zero = (places - num.toString().length) + 1;
  return Array(+(zero > 0 && zero)).join(char) + num;
}

export const getLast4Chars = (number: string) => number.slice(-4);

export const replace = (str: string, replacement = '') => str.replace(/ /g, replacement);

export const reduceFnByID = (acc: Object, it: Object) => {
  acc[it.id] = it;
  return acc;
};

export function setImmutable(obj: any, attr: string, value: any) {
  const attrArr = attr.split('.');
  const [tattr, nattr] = attrArr;
  return Object.assign({},
    obj,
    { [tattr]: !!nattr ? setImmutable(obj[tattr] || {}, attrArr.slice(1).join('.'), value) : value }
  );
}

export function deleteImmutable(obj: any, key: string) {
  const newObj = { ...obj };
  delete newObj[key];
  return newObj;
}

export const filterKeys = (obj: any, keys: string[]) =>
  Object.keys(obj)
    .filter((key: string) => !!obj[key] && keys.includes(key))
    .reduce((objAcc: Object, key: string) => (objAcc[key] = obj[key], objAcc), {});

export const uniqFilterFn = (value: any, index: number, arr: Array<any>) =>
  arr.indexOf(value) === index;


export const inputRequired = value => (value ? undefined : 'Required');

export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

export const upsertDoc: Promise = ({ id, ...data }: Object, collection: Object) =>
  id
    ? collection.doc(id).set(data)
    : collection.add(data);

export const upsertRealtDoc: Promise = ({ id, ...data }: Object, dbRef: Object) =>
  id
    ? dbRef.child(id).set(data)
    : dbRef.push(data);

export const mapCreditCardTypeAsIconName = (type: string) => {
  switch (type) {
    case 'visa': return 'cc-visa';
    case 'master-card': return 'cc-mastercard';
    case 'american-express': return 'cc-amex';
    case 'diners-club': return 'cc-dinners-club';
    case 'discover': return 'cc-discover';
    case 'jcb': return 'cc-jcb';
    default: return 'cc';
  }
};

export const mapCreditCardTypeName = (type: string) => {
  switch (type) {
    case 'visa': return 'Visa';
    case 'master-card': return 'MasterCard';
    case 'american-express': return 'Amex';
    case 'diners-club': return 'DinnersClub';
    case 'discover': return 'Discover';
    case 'jcb': return 'JBC';
    default: return 'Tarjeta';
  }
};

export const formatCreditCardText = (creditCard: CreditCard) =>
  `${mapCreditCardTypeName(creditCard.type)} ending in ${getLast4Chars(creditCard.number)}`;

export default null;
