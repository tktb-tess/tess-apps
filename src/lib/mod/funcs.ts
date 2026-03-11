export const formatCentStr = (cents: number): string | readonly [string, string] => {
  if (cents < 0.1) {
    const str = cents.toExponential(4);
    const matched = str.match(/^(\d\.\d+)e(-\d+)/);
    const num = matched?.[1];
    const exp = matched?.[2];
    if (!num || !exp) return str;
    return [num, exp];
  } else {
    return cents.toFixed(4);
  }
};
