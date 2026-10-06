import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    credentials: 'include',
  }),
  tagTypes: ['Courses', 'Course', 'Gallery', 'Testimonials', 'Faqs', 'Settings', 'Mentors', 'About', 'Campuses', 'Messages'],
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
    getWebsiteSettings: builder.query({
      query: () => '/website-settings',
      providesTags: ['Settings'],
    }),
    getMentors: builder.query({
      query: () => '/mentors',
      providesTags: ['Mentors'],
    }),
    getAboutPage: builder.query({
      query: () => '/about',
      providesTags: ['About'],
    }),
    getCampuses: builder.query({
      query: () => '/campuses',
      providesTags: ['Campuses'],
    }),
    submitContact: builder.mutation({
      query: (body) => ({
        url: '/contact',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Messages'],
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

    // Admin Settings CRM
    getAdminSettings: builder.query({
      query: () => '/admin/settings',
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation({
      query: (body) => ({
        url: '/admin/settings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),

    // Admin Mentors CRM
    getAdminMentors: builder.query({
      query: () => '/admin/mentors',
      providesTags: ['Mentors'],
    }),
    createMentor: builder.mutation({
      query: (body) => ({
        url: '/admin/mentors',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Mentors'],
    }),
    deleteMentor: builder.mutation({
      query: (id) => ({
        url: `/admin/mentors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Mentors'],
    }),

    // Admin About Page CRM
    getAdminAbout: builder.query({
      query: () => '/admin/about',
      providesTags: ['About'],
    }),
    updateAbout: builder.mutation({
      query: (body) => ({
        url: '/admin/about',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['About'],
    }),

    // Admin Campuses CRM
    getAdminCampuses: builder.query({
      query: () => '/admin/campuses',
      providesTags: ['Campuses'],
    }),
    createCampus: builder.mutation({
      query: (body) => ({
        url: '/admin/campuses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Campuses'],
    }),
    deleteCampus: builder.mutation({
      query: (id) => ({
        url: `/admin/campuses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Campuses'],
    }),

    // Admin Leads / Messages CRM
    getAdminMessages: builder.query({
      query: () => '/admin/messages',
      providesTags: ['Messages'],
    }),
    updateMessageStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/messages/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Messages'],
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `/admin/messages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Messages'],
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
  useGetWebsiteSettingsQuery,
  useGetMentorsQuery,
  useGetAboutPageQuery,
  useGetCampusesQuery,
  useSubmitContactMutation,
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
  useGetAdminSettingsQuery,
  useUpdateSettingsMutation,
  useGetAdminMentorsQuery,
  useCreateMentorMutation,
  useDeleteMentorMutation,
  useGetAdminAboutQuery,
  useUpdateAboutMutation,
  useGetAdminCampusesQuery,
  useCreateCampusMutation,
  useDeleteCampusMutation,
  useGetAdminMessagesQuery,
  useUpdateMessageStatusMutation,
  useDeleteMessageMutation,
  useLoginMutation,
} = apiSlice;
