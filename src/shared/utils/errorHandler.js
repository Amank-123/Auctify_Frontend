const getErrorMessage = (error) => {
  if (error.response) return error.response.data?.message || 'server error';
  if (error.request) return 'Server not responding';
  return error.message || 'Something went wrong';
};
export { getErrorMessage };
