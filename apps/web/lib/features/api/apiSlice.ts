import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? (typeof window !== 'undefined' ? '/api/v1' : 'http://localhost:5000/api/v1'),
    credentials: 'include',
  }),
  tagTypes: ['Courses', 'Course', 'Gallery', 'Testimonials', 'Faqs', 'Settings', 'Mentors', 'About', 'Campuses', 'Messages', 'Pages', 'Page', 'Navigation', 'Media', 'Users', 'Dashboard', 'Certificates'],
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
    verifyCertificate: builder.query({
      query: (certificateNumber: string) => `/certificates/verify/${encodeURIComponent(certificateNumber)}`,
      providesTags: ['Certificates'],
    }),

    // Admin Certificate Endpoints
    getAdminCertificates: builder.query({
      query: (params?: { q?: string }) => {
        const q = params?.q ? `?q=${encodeURIComponent(params.q)}` : '';
        return `/admin/certificates${q}`;
      },
      providesTags: ['Certificates'],
    }),
    getAdminCertificateById: builder.query({
      query: (id: string) => `/admin/certificates/${id}`,
      providesTags: ['Certificates'],
    }),
    createCertificate: builder.mutation({
      query: (body) => ({
        url: '/admin/certificates',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Certificates'],
    }),
    updateCertificate: builder.mutation({
      query: ({ id, ...body }: { id: string; [key: string]: any }) => ({
        url: `/admin/certificates/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Certificates'],
    }),
    deleteCertificate: builder.mutation({
      query: (id: string) => ({
        url: `/admin/certificates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Certificates'],
    }),
    updateAuthoritySignatures: builder.mutation({
      query: (body) => ({
        url: '/admin/certificates/signatures',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Certificates', 'Settings'],
    }),
    seedCertificates: builder.mutation({
      query: () => ({
        url: '/admin/certificates/seed',
        method: 'POST',
      }),
      invalidatesTags: ['Certificates'],
    }),

    // Admin Endpoints
    getAdminCourses: builder.query({
      query: () => '/admin/courses',
      providesTags: ['Courses'],
    }),
    getAdminCourseById: builder.query({
      query: (id) => `/admin/courses/${id}`,
      providesTags: ['Course'],
    }),
    seedCourses: builder.mutation({
      query: () => ({
        url: '/admin/courses/seed',
        method: 'POST',
      }),
      invalidatesTags: ['Courses'],
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

    // Admin Gallery Endpoints
    getAdminGallery: builder.query({
      query: () => '/gallery',
      providesTags: ['Gallery'],
    }),
    createGalleryItem: builder.mutation({
      query: (body) => ({
        url: '/admin/gallery',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Gallery'],
    }),
    deleteGalleryItem: builder.mutation({
      query: (id) => ({
        url: `/admin/gallery/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Gallery'],
    }),

    // Auth Endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['Dashboard'],
      keepUnusedDataFor: 5,
    }),

    // Dashboard
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard/stats',
      providesTags: ['Dashboard'],
    }),

    // Pages CMS
    getAdminPages: builder.query({
      query: () => '/admin/pages',
      providesTags: ['Pages'],
    }),
    getAdminPage: builder.query({
      query: (id) => `/admin/pages/${id}`,
      providesTags: ['Page'],
    }),
    createPage: builder.mutation({
      query: (body) => ({ url: '/admin/pages', method: 'POST', body }),
      invalidatesTags: ['Pages', 'Dashboard'],
    }),
    updatePageMeta: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/pages/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Pages', 'Page'],
    }),
    deletePage: builder.mutation({
      query: (id) => ({ url: `/admin/pages/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Pages', 'Dashboard'],
    }),
    duplicatePage: builder.mutation({
      query: (id) => ({ url: `/admin/pages/${id}/duplicate`, method: 'POST' }),
      invalidatesTags: ['Pages'],
    }),
    publishPage: builder.mutation({
      query: (id) => ({ url: `/admin/pages/${id}/publish`, method: 'POST' }),
      invalidatesTags: ['Pages', 'Page', 'Dashboard'],
    }),
    unpublishPage: builder.mutation({
      query: (id) => ({ url: `/admin/pages/${id}/unpublish`, method: 'POST' }),
      invalidatesTags: ['Pages', 'Page', 'Dashboard'],
    }),
    getPagePreview: builder.query({
      query: (id) => `/admin/pages/${id}/preview`,
    }),
    addSection: builder.mutation({
      query: ({ pageId, ...body }) => ({ url: `/admin/pages/${pageId}/sections`, method: 'POST', body }),
      invalidatesTags: ['Page', 'Pages'],
    }),
    updateSection: builder.mutation({
      query: ({ sectionId, ...body }) => ({ url: `/admin/sections/${sectionId}`, method: 'PATCH', body }),
      invalidatesTags: ['Page'],
    }),
    deleteSection: builder.mutation({
      query: (sectionId) => ({ url: `/admin/sections/${sectionId}`, method: 'DELETE' }),
      invalidatesTags: ['Page', 'Pages'],
    }),
    reorderSections: builder.mutation({
      query: (sectionIds) => ({ url: '/admin/sections/reorder', method: 'POST', body: { sectionIds } }),
      invalidatesTags: ['Page'],
    }),

    // Navigation CMS
    getAdminNavigation: builder.query({
      query: () => '/admin/navigation',
      providesTags: ['Navigation'],
    }),
    createMenuItem: builder.mutation({
      query: ({ location, ...body }) => ({ url: `/admin/navigation/${location}/items`, method: 'POST', body }),
      invalidatesTags: ['Navigation'],
    }),
    updateMenuItem: builder.mutation({
      query: ({ itemId, ...body }) => ({ url: `/admin/navigation/items/${itemId}`, method: 'PATCH', body }),
      invalidatesTags: ['Navigation'],
    }),
    deleteMenuItem: builder.mutation({
      query: (itemId) => ({ url: `/admin/navigation/items/${itemId}`, method: 'DELETE' }),
      invalidatesTags: ['Navigation'],
    }),
    reorderMenuItems: builder.mutation({
      query: (itemIds) => ({ url: '/admin/navigation/items/reorder', method: 'POST', body: { itemIds } }),
      invalidatesTags: ['Navigation'],
    }),

    // Media Library
    getMedia: builder.query({
      query: (params) => {
        const q = new URLSearchParams();
        if (params?.page) q.set('page', String(params.page));
        if (params?.limit) q.set('limit', String(params.limit));
        if (params?.search) q.set('search', params.search);
        if (params?.folder) q.set('folder', params.folder);
        const qs = q.toString();
        return `/admin/media${qs ? `?${qs}` : ''}`;
      },
      providesTags: ['Media'],
    }),
    updateMedia: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/media/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Media'],
    }),
    deleteMedia: builder.mutation({
      query: (id) => ({ url: `/admin/media/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Media', 'Dashboard'],
    }),

    // Users
    getAdminUsers: builder.query({
      query: () => '/admin/users',
      providesTags: ['Users'],
    }),
    createAdminUser: builder.mutation({
      query: (body) => ({ url: '/admin/users', method: 'POST', body }),
      invalidatesTags: ['Users'],
    }),
    updateAdminUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/users/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Users'],
    }),
    deleteAdminUser: builder.mutation({
      query: (id) => ({ url: `/admin/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Users'],
    }),

    // Audit logs
    getAuditLogs: builder.query({
      query: (limit) => `/admin/audit-logs${limit ? `?limit=${limit}` : ''}`,
      providesTags: ['Dashboard'],
    }),

    // Public CMS
    getPublicPage: builder.query({
      query: (slug) => `/pages/${slug}`,
      providesTags: ['Pages'],
    }),
    getPublicNavigation: builder.query({
      query: (location) => `/navigation/${location}`,
      providesTags: ['Navigation'],
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
  useGetAdminCourseByIdQuery,
  useSeedCoursesMutation,
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
  useGetAdminGalleryQuery,
  useCreateGalleryItemMutation,
  useDeleteGalleryItemMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetDashboardStatsQuery,
  useGetAdminPagesQuery,
  useGetAdminPageQuery,
  useCreatePageMutation,
  useUpdatePageMetaMutation,
  useDeletePageMutation,
  useDuplicatePageMutation,
  usePublishPageMutation,
  useUnpublishPageMutation,
  useLazyGetPagePreviewQuery,
  useAddSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useReorderSectionsMutation,
  useGetAdminNavigationQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useReorderMenuItemsMutation,
  useGetMediaQuery,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  useGetAuditLogsQuery,
  useGetPublicPageQuery,
  useGetPublicNavigationQuery,
  useVerifyCertificateQuery,
  useLazyVerifyCertificateQuery,
  useGetAdminCertificatesQuery,
  useGetAdminCertificateByIdQuery,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
  useUpdateAuthoritySignaturesMutation,
  useSeedCertificatesMutation,
} = apiSlice;

