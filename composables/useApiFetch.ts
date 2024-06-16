import type { UseFetchOptions } from '#imports';
import { ref } from 'vue';

export function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}) {
  let headers: any = {
    accept: 'application/json',
    referer: 'https://flowboard-be-f933713bceca.herokuapp.com',
  };

  const token = useCookie('XSRF-TOKEN', {
    secure: true,
  });

  if (token.value) {
    headers['X-XSRF-TOKEN'] = token.value as string;
  }

  if (process.server) {
    headers = {
      ...headers,
      ...useRequestHeaders(['cookie']),
    };
  }

  const fetchOptions = {
    credentials: 'include',
    watch: false,
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  };

  const responseHandler = async (response: Response) => {
    const setCookieHeader = response.headers.get('Set-Cookie');
    if (setCookieHeader) {
      // Parse the Set-Cookie header to extract cookie name and value
      const cookieParts = setCookieHeader.split(';')[0].split('=');
      const cookieName = cookieParts[0].trim();
      const cookieValue = cookieParts[1].trim();

      // Set the cookie with document.cookie
      document.cookie = `${cookieName}=${cookieValue}; path=/; SameSite=Lax`;

      // Optionally update token.value if it matches the cookie name
      if (token.value && cookieName === 'XSRF-TOKEN') {
        token.value = cookieValue;
      }
    }

    return response;
  };

  return useFetch('https://flowboard-be-f933713bceca.herokuapp.com' + path, {
    ...fetchOptions,
    onDone: responseHandler,
    onError: (error: Error) => {
      console.error('Fetch error:', error);
      // Handle error as needed
    },
  });
}
