export default (data?: { token?: string; refreshToken?: string }) => {
  if (data?.token?.length && data?.refreshToken?.length) {
    localStorage.setItem('refresh-token', data.refreshToken);
    localStorage.setItem('token', data.token);
  }
};
