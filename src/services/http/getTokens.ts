export default () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refresh-token');
  return { token, refreshToken };
};
