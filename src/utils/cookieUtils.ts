const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length !== 2) return null;
  return parts.pop()?.split(';').shift() || null;
};

const setCookie = (name: string, value: string, days: number): void => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`;
};

const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; Max-Age=-99999999;`;
};

export {getCookie, setCookie, deleteCookie};
