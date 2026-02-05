type ApiResponseEnvelope<T> = {
  data?: T;
};

type ApiResponse<T> = {
  data?: ApiResponseEnvelope<T> | T;
};

export const getApiData = <T>(response: unknown): T | null => {
  if (!response || typeof response !== 'object') {
    return null;
  }

  const payload = (response as ApiResponse<T>).data;
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponseEnvelope<T>).data ?? null;
  }

  return (payload as T) ?? null;
};

export const getErrorMessage = (error: unknown) => {
  const message =
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    (error instanceof Error ? error.message : null);

  return message || 'Something went wrong. Please try again.';
};
