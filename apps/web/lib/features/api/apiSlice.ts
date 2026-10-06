import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    credentials: 'include',
  }),
  tagTypes: ['Courses', 'Course', 'Gallery', 'Testimonials', 'Faqs'],
  endpoints: (builder) => ({
    // Public Endpoints
    getCourses: builder.query({
      query: () => '/courses',
      providesTags: ['Courses'],
    }),
    getGallery: builder.query({
      query: () => '/gallery',
      providesTags: ['Gallery'],
    }),
    getTestimonials: builder.query({
      query: () => '/testimonials',
      providesTags: ['Testimonials'],
    }),
    getFaqs: builder.query({
      query: () => '/faqs',
      providesTags: ['Faqs'],
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

    // Admin FAQ Endpoints
    getAdminFaqs: builder.query({
      query: () => '/admin/faqs',
      providesTags: ['Faqs'],
    }),
    createFaq: builder.mutation({
      query: (body) => ({
        url: '/admin/faqs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Faqs'],
    }),
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `/admin/faqs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Faqs'],
    }),

    // Admin Testimonial Endpoints
    getAdminTestimonials: builder.query({
      query: () => '/admin/testimonials',
      providesTags: ['Testimonials'],
    }),
    createTestimonial: builder.mutation({
      query: (body) => ({
        url: '/admin/testimonials',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Testimonials'],
    }),
    deleteTestimonial: builder.mutation({
      query: (id) => ({
        url: `/admin/testimonials/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Testimonials'],
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
  useGetGalleryQuery,
  useGetTestimonialsQuery,
  useGetFaqsQuery,
  useGetAdminCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetAdminFaqsQuery,
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetAdminTestimonialsQuery,
  useCreateTestimonialMutation,
  useDeleteTestimonialMutation,
  useLoginMutation,
} = apiSlice;
