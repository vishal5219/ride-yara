import Cookies from 'js-cookie';

export const getToken = () => Cookies.get('token');
export const isAuthenticated = () => !!getToken();
export const logout = () => {
  Cookies.remove('token');
  window.location.href = '/login';
}; 