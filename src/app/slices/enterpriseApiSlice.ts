// src/app/slices/enterpriseApiSlice.ts
import { apiSlice } from "./apiSlice";

export const enterpriseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startActivation: builder.mutation({
      query: (body) => ({
        url: "/api/enterprise",
        method: "POST",
        body,
      }),
    }),

    updateEnterpriseDetails: builder.mutation({
      query: ({ activation_id, ...body }) => ({
        url: `/api/enterprise/${activation_id}/details`,
        method: "PUT",
        body,
      }),
    }),

    chooseActivationMethod: builder.mutation({
      query: ({ activation_id, ...body }) => ({
        url: `/api/enterprise/${activation_id}/method`,
        method: "POST",
        body,
      }),
    }),

    addFarms: builder.mutation({
      query: ({ activation_id, farms }) => ({
        url: `/api/enterprise/${activation_id}/farms`,
        method: "POST",
        body: { farms },
      }),
    }),

    sendInvitations: builder.mutation({
      query: (activation_id) => ({
        url: `/api/enterprise/${activation_id}/send-invitations`,
        method: "POST",
      }),
    }),

    getActivationStatus: builder.query({
      query: (activation_id) => `/api/enterprise/${activation_id}`,
    }),

    getLatestUserActivation: builder.query({
  query: () => "/api/enterprise/latest",
  providesTags: ["User"],
}),

    getMyActivations: builder.query({
      query: (params) => ({
        url: "/api/enterprise",
        params,
      }),
    }),

    deleteActivation: builder.mutation({
      query: (activation_id) => ({
        url: `/api/enterprise/${activation_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useStartActivationMutation,
  useUpdateEnterpriseDetailsMutation,
  useChooseActivationMethodMutation,
  useAddFarmsMutation,
  useSendInvitationsMutation,
  useGetActivationStatusQuery,
  useGetMyActivationsQuery,
  useDeleteActivationMutation,
  useGetLatestUserActivationQuery
} = enterpriseApiSlice;