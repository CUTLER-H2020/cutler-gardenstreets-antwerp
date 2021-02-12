import { formatNumber } from './format';

export const EURO_UNIT = 'euro';
export const EURO_PER_SQUARED_METER_UNIT = 'euro/m^2';
export const METER_UNIT = 'meter';
export const PERCENT_UNIT = 'percent';

export const unitConfigs = {
  [EURO_UNIT]: { label: '€', format: formatNumber },
  [EURO_PER_SQUARED_METER_UNIT]: { label: '€/m²', format: formatNumber },
  [METER_UNIT]: {
    label: 'm',
    format: (value: number) => formatNumber(value, 2),
  },
  [PERCENT_UNIT]: {
    label: '%',
    format: (value: number) => formatNumber(value, 2),
  },
};
