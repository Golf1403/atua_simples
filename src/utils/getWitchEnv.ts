export const getWitchEnv = () => {
  if (process.env.REACT_APP_ENV === 'prod') {
    return true;
  }
  return false;
};
