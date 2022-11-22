// @flow
import type {Location, KeyLabel, CartItem} from '../types';

export const rowHeight: number = 54;

export const yellow: string = '#F2BF40';
export const lighterGray: string = '#F1F1F1';
export const lightGray: string = '#cccccc';
export const gray: string = '#B3B3B3';
export const darkGray: string = '#666666';
export const darkerGray: string = '#4D4D4D';
export const red: string = '#eb1c23';
export const green: string = '#3CCC3E';

export const switchTrackColor = {
  false: lightGray,
  true: red,
};

export const FACEBOOK_APPID = '559131207620680';

export const currency: string = 'RD$';
export const curr: string = '$';

export const AD_RATIO = 0.4629;

export const defaultEmptyArr: Array = [];
export const defaultEmptyObj: Object = {};
export const defaultQty0: CartItem = { qty: 0 };

export const mainCityLocation: Location = {
  latitude: 18.50012,
  longitude: -69.98857,
};


export const weekDays: KeyLabel[] = [
  { key: 0, label: 'Domingo' },
  { key: 1, label: 'Lunes' },
  { key: 2, label: 'Martes' },
  { key: 3, label: 'Miércoles' },
  { key: 4, label: 'Jueves' },
  { key: 5, label: 'Viernes' },
  { key: 6, label: 'Sábado' },
];

const avTimes: number[] = [
  800, 830, 900, 930, 1000, 1030, 1100, 1130, 1200, 1230,
  1300, 1330, 1400, 1430, 1500, 1530, 1600, 1630, 1700,
  1730, 1800, 1830, 1900, 1930, 2000, 2030, 2100, 2130,
];

export const availableTimes: KeyLabel[] = avTimes.map((n) => {
  const dec = n / 100;
  const hh24 = Math.floor(dec);
  const amPm = hh24 < 12 ? 'am' : 'pm';
  const hh = hh24 - (hh24 > 12 ? 12 : 0);
  const mm = ((dec % 1) * 100).toFixed(0).padStart(2, '0');
  return { key: n, label: `${hh}:${mm} ${amPm}` };
});


export default null;
