import jwtDecode from 'jwt-decode';
import { API_URL } from './constants';

export const authUser = async (user, password) => {
  try {
    const res = await fetch(`${API_URL}/user/login`, {
      method: 'post',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: user,
        password,
      }),
    });

    const jsonRes = await res.json();

    const { success, accessToken } = jsonRes;

    if (success) {
      localStorage.setItem('token', accessToken);

      return true;
    }
  } catch (err) {
    console.log(err);
  }

  return false;
};

export const refreshToken = async () => {
  try {
    const res = await fetch(`${API_URL}/user/refresh-token`, { credentials: 'include' });

    const jsonRes = await res.json();

    const { success, accessToken } = jsonRes;

    if (success) {
      localStorage.setItem('token', accessToken);

      return true;
    }
  } catch (err) {
    console.log(err);
  }

  return false;
};

export const authFetch = async (input: RequestInfo, init?: RequestInit) => {
  try {
    const { exp } = jwtDecode(localStorage.getItem('token'));

    // Token is not valid
    if (!(exp && exp > Date.now() * 1000)) await refreshToken();

    const res = await fetch(input, {
      ...init,
      headers: { authorization: `Bearer ${localStorage.getItem('token')}`, ...init.headers },
    });

    const jsonRes = await res.json();

    return jsonRes;
  } catch (err) {
    console.log(err);
  }

  return false;
};
