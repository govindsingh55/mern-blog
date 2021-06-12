import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState()).auth.token
      if (token) {
        headers.set('authentication', `Bearer ${token}`)
      }
      return headers
    },
  }),

  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => `blogs`,
    }),
    getBlog: builder.query({
      query: (blogId) => `blog/${blogId}`
    }),
    addBlog: builder.mutation({
      query: (data) => ({
        url: 'blog',
        method: 'POST',
        body: data
      })
    }),
    updateBlog: builder.mutation({
      query: (data) => ({
        url: 'blog',
        method: 'PATCH',
        body: data
      })
    }),
    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `blog/${blogId}`,
        method: 'DELETE'
      })
    }),

    addUser: builder.mutation({
      query: (data) => ({
        url: `register`,
        method: 'POST',
        body: data
      })
    }),

    loginUser: builder.mutation({
      query: (data) => ({
        url: `login`,
        method: 'POST',
        body: data
      })
    }),
  }),
})

export const {
  useGetBlogsQuery,
  useLazyGetBlogsQuery,
  useGetBlogQuery,
  useLazyGetBlogQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useAddUserMutation,
  useLoginUserMutation
} = api;