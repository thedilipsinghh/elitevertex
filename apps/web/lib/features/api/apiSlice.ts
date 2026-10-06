import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    credentials: 'include',
  }),
  tagTypes: ['Courses', 'Course'],
  endpoints: (builder) => ({
    // Public Endpoints
    getCourses: builder.query({
      query: () => '/courses',
      providesTags: ['Courses'],
    }),

    // Admin Endpoints
    getAdminCourses: builder.query({
      query: () => '/admin/courses',
      providesTags: ['Courses'],
    }),
    createCourse: builder.mutation({
      query: (body) => ({
        url: '/admin/courses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Courses'],
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/courses/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Courses', 'Course'],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/admin/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Courses'],
    }),

    // Auth Endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetAdminCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useLoginMutation,
} = apiSlice;
