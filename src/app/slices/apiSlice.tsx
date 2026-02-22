import { fetchBaseQuery, createApi, BaseQueryFn, FetchBaseQueryError, FetchArgs } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants";
import { logout } from "./authSlice";
import { RootState } from "../store"; // Import RootState for better type safety

// Define the base query with authentication handling
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // Ensures cookies/session are included
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.userInfo?.token; // Access token safely

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Extend baseQuery to handle 401 (Unauthorized) errors
const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extra) => {
  const result = await baseQuery(args, api, extra);

  if (result.error?.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

// Create an API slice with TypeScript support
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],
  endpoints: (builder) => ({})
});

export default apiSlice;
