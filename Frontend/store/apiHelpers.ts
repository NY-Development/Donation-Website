type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type AxiosResponse<T> = {
  data?: ApiResponse<T> | T;
};

export const getApiData = <T>(response: unknown): T | null => {
  if (!response || typeof response !== 'object') {
    return null;
  }

  const payload = (response as AxiosResponse<T>).data;
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data ?? null;
  }

  return (payload as T) ?? null;
};

export const getErrorMessage = (error: unknown) => {
  const message =
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    (error instanceof Error ? error.message : null);

  return message || 'Something went wrong. Please try again.';
};
