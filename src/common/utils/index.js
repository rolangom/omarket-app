// @flow
// import {
//   // DocumentReference,
//   QuerySnapshot,
//   // DocumentSnapshot,
//   // FirebaseFirestore,
// } from '@firebase/firestore-types';

import { currency } from './constants';

// const colors

export const getDocs = querySnapshot =>
  querySnapshot
    .docs
    .map(it => ({ id: it.id, ...it.data() }));

export const getDocsAsDict = querySnapshot =>
  querySnapshot
    .docs
    .reduce((acc, it) => {
      acc[it.id] = { id: it.id, ...it.data() };
      return acc;
    }, {});

const sortFnAsc = (attr: string) => (a, b) => (a[attr] || 100) - (b[attr] || 100);
const sortFnDesc = (attr: string) => (a, b) => (b[attr] || 100) - (a[attr] || 100);

export const sortBy = (data: Array, attr: string, asc: boolean = true) =>
  data
    .sort((asc ? sortFnAsc : sortFnDesc)(attr));

export const getPriceWithCurrency = (price: number, pCurrency = currency) => `${pCurrency} ${price || 0}`;

export function padStart(num, places, char = '0') {
  const zero = (places - num.toString().length) + 1;
  return Array(+(zero > 0 && zero)).join(char) + num;
}

export const reduceFnByID = (acc, it) => {
  acc[it.id] = it;
  return acc;
};

export function setImmutable(obj, attr, value) {
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
    .reduce((objAcc: any, key: string) => {
      objAcc[key] = obj[key];
      return objAcc;
    }, {});

export default null;
