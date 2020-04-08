import * as R from 'ramda';

export const assocIsNotNill = (key, data) => (obj) => R.ifElse(
  R.isNil,
  R.always(obj),
  R.assoc(key, R.__, obj)
)(data);
