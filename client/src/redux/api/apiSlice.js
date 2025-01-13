import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }), 
  tagTypes: ['Friends', 'Profile'],
  endpoints: (builder) => ({
    fetchFriends: builder.query({
      query: (username) => `/friend/display?username=${username}`,
      providesTags: ['Friends'],
    }),
    getProfile: builder.query({
      query: (id) => `/dash/alumni/profiledetails?id=${id}`,
      providesTags: ['Profile'],
    }),
    // New endpoint for updating additional info
    updateAddInfo: builder.mutation({
      query: (data) => ({
        url: '/dash/alumni/updateAddInfo',
        method: 'POST',
        body: data, 
      }),
    }),

    updateProfileDetails: builder.mutation({
      query:(data) =>({
        url: '/dash/alumni/profileupdate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),

    connectToFriend: builder.mutation({
      query: (data) =>({
        url:'/friend/connect',
        method:'POST',
        body: data,
      }),
      invalidatesTags: ['Friends'],                                             
    }),

    getRandomPosts: builder.query({
      query: (id) => `/v1/post/randomPosts?id=${id}`,
    }),

    getAlumniSuggestions: builder.query({
      query: (id) => `/dash/alumni/suggest?id=${id}`
    }),
    
    getAddInfo: builder.query({
      query: (id) => ({
        url: `/dash/alumni/addInfo?id=${id}`,
      }),
    }),
  }),
});

export const {
  useFetchFriendsQuery,
  useGetProfileQuery,
  useUpdateAddInfoMutation,  
  useGetAddInfoQuery, 
  useUpdateProfileDetailsMutation,  
  useGetRandomPostsQuery,   
  useGetAlumniSuggestionsQuery,  
  useConnectToFriendMutation,
} = apiSlice;
