// @flow
// import {
//   // DocumentReference,
//   QuerySnapshot,
//   // DocumentSnapshot,
//   // FirebaseFirestore,
// } from '@firebase/firestore-types';

// const colors

export const getDocs = querySnapshot =>
  querySnapshot
    .docs
    .map(it => ({ id: it.id, ...it.data() }));

export const getPriceWithCurrency = (price: number, currency = 'RD$') => `${currency} ${price || 0}`;

export default null;
