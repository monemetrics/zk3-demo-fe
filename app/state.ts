
let authenticationToken: string = 'default';
export let setAuthenticationToken = (token: string) => {
  authenticationToken = token;
  console.log('setAuthenticationToken: token', token);
};

export let getAuthenticationToken = () => {
  return authenticationToken;
};