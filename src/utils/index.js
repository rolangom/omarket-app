// @flow
// import {
//   // DocumentReference,
//   QuerySnapshot,
//   // DocumentSnapshot,
//   // FirebaseFirestore,
// } from '@firebase/firestore-types';

import { currency } from '../config/constants';

// const colors

export const getDocs = querySnapshot =>
  querySnapshot
    .docs
    .map(it => ({ id: it.id, ...it.data() }));

export const getPriceWithCurrency = (price: number, pCurrency = currency) => `${pCurrency} ${price || 0}`;

export function padStart(num, places, char = '0') {
  const zero = (places - num.toString().length) + 1;
  return Array(+(zero > 0 && zero)).join(char) + num;
}


export default null;
