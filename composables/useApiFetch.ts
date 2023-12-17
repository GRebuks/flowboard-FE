import type { UseFetchOptions } from '#imports'

export function useApiFetch<T> (path: string, options: UseFetchOptions<T> = {}) {
  let headers: any = {
    accept: "application/json",
    referer: "http://localhost:3000",
  }

  const token = useCookie('XSRF-TOKEN', {
    secure: true
  });

  if (token.value) {
    headers['X-XSRF-TOKEN'] = token.value as string;
  }

  if (process.server) {
    headers = {
      ...headers,
      ...useRequestHeaders(["cookie"])
    }
  }

  return useFetch("http://localhost:80" + path, {
    credentials: 'include',
    watch: false,
    ...options,
    headers: {
      ...headers,
      ...options?.headers
    }
  });
}