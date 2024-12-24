import axios, { AxiosResponse } from "axios";

interface RequestOptions<T = Record<string, any>, U = Record<string, any>> {
  url: string;
  data?: U;
  headers?: Record<string, string>;
  timeout?: number;
  params?: Record<string, any>;
}

/**
 * Handles errors thrown by Axios requests.
 * @param {any} error - Axios error object.
 * @throws {Error} - Re-throws an error with a detailed message.
 */
function handleAxiosError(error: any): never {
  if (error.response) {
    const { status, statusText, data } = error.response;
    console.error("Server Error:", data);
    throw new Error(
      `Server responded with status ${status} (${statusText}): ${
        data.message || "Unknown error"
      }`
    );
  } else if (error.request) {
    console.error("Network Error:", error.message);
    throw new Error("Network error. Please check your connection.");
  } else {
    console.error("Error:", error.message);
    throw new Error("Error in setting up the request: " + error.message);
  }
}

/**
 * Sends a POST request using Axios.
 * @param {RequestOptions<T, U>} options - Request configuration.
 * @returns {Promise<AxiosResponse<T>>} - Response data or throws an error.
 */
export async function sendPostRequest<
  T = Record<string, any>,
  U = Record<string, any>,
>({
  url,
  data = {} as U,
  headers = { "Content-Type": "application/json" },
  timeout = 5000,
}: RequestOptions<T, U>): Promise<AxiosResponse<T>> {
  try {
    return await axios.post<T>(url, data, { headers, timeout });
  } catch (error) {
    handleAxiosError(error);
  }
}

/**
 * Sends a GET request using Axios.
 * @param {RequestOptions<T>} options - Request configuration.
 * @returns {Promise<AxiosResponse<T>>} - Response data or throws an error.
 */
export async function sendGetRequest<T = Record<string, any>>({
  url,
  headers = { "Content-Type": "application/json" },
  timeout = 5000,
  params = {},
}: RequestOptions<T>): Promise<AxiosResponse<T>> {
  try {
    return await axios.get<T>(url, { headers, timeout, params });
  } catch (error) {
    handleAxiosError(error);
  }
}

/**
 * Sends a PUT request using Axios.
 * @param {RequestOptions<T, U>} options - Request configuration.
 * @returns {Promise<AxiosResponse<T>>} - Response data or throws an error.
 */
export async function sendPutRequest<
  T = Record<string, any>,
  U = Record<string, any>,
>({
  url,
  data = {} as U,
  headers = { "Content-Type": "application/json" },
  timeout = 5000,
}: RequestOptions<T, U>): Promise<AxiosResponse<T>> {
  try {
    return await axios.put<T>(url, data, { headers, timeout });
  } catch (error) {
    handleAxiosError(error);
  }
}

/**
 * Sends a DELETE request using Axios.
 * @param {RequestOptions<T>} options - Request configuration.
 * @returns {Promise<AxiosResponse<T>>} - Response data or throws an error.
 */
export async function sendDeleteRequest<T = Record<string, any>>({
  url,
  headers = { "Content-Type": "application/json" },
  timeout = 5000,
  params = {},
}: RequestOptions<T>): Promise<AxiosResponse<T>> {
  try {
    return await axios.delete<T>(url, { headers, timeout, params });
  } catch (error) {
    handleAxiosError(error);
  }
}
