export const formatCentStr = (cents: number) => {
  if (cents < 0.1) {
    const str = cents.toExponential(4);
    const matched = str.match(/^(?<num>\d\.\d+)e(?<exp>-\d+)/);
    const num = matched?.groups?.num;
    const exp = matched?.groups?.exp;
    if (!num || !exp) return str;
    return [num, exp] as const;
  } else {
    return cents.toFixed(4);
  }
};
