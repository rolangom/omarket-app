import firebase from 'firebase';

require('firebase/firestore');

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyB5WhFpENPLUlpDrTjvfm2XH_gx2eebQT0',
  authDomain: 'shop-f518d.firebaseapp.com',
  databaseURL: 'https://shop-f518d.firebaseio.com',
  projectId: 'shop-f518d',
  storageBucket: 'shop-f518d.appspot.com',
  messagingSenderId: '972825688380',
});
export const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true,
});

export default firebase;
