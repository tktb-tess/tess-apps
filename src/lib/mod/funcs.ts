export const formatCentStr = (cents: number) => {
  if (cents > 0 && cents < 0.1) {
    const str = cents.toExponential(5);
    const regex = /^(?<num>\d\.\d+)e(?<exp>-\d+)/;
    const matched = regex.exec(str)?.groups;
    const num = matched?.num;
    const exp = matched?.exp;
    if (!num || !exp) return str;
    return [num, exp] as const;
  } else {
    return cents.toFixed(5);
  }
};

export const createDate = (date: string) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) {
    throw Error('Invalid date', { cause: { input: date } });
  }
  return d;
};
