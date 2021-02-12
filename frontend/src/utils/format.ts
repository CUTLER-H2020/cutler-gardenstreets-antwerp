export function formatNumber(value: number, maximumFractionDigits = 0) {
  return typeof value === 'number'
    ? value.toLocaleString([], { maximumFractionDigits })
    : '-';
}

export function formatEligible(eligible: boolean | null) {
  if (eligible === null) {
    return 'No value set';
  }
  return eligible ? 'True' : 'False';
}

export function formatString(value: string | null) {
  if (value === null) {
    return '-';
  }
  return value;
}
