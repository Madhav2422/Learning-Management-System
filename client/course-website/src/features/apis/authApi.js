import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "http://localhost:8080/api/v1/user/";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: USER_API,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        // Register user endpoint
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: "register",
                method: "POST",
                body: inputData,
            }),
        }),

        // Login user endpoint
        loginUser: builder.mutation({
            query: (inputData) => ({
                url: "login",
                method: "POST",
                body: inputData,
            }),
            // This function will be called when mutation is started
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled; // In queryFulfilled, backend (user) data will be stored
                    dispatch(userLoggedIn({ user: result.data.user }));
                } catch (error) {
                    console.log(error);
                }
            },
        }),

        // Logout user endpoint
        logoutUser: builder.mutation({
            query: () => ({
                url:"logout",
                method:"GET"
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try { 
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.log(error);
                }
            }
        }),

        // Load user endpoint
        loadUser: builder.query({
            query: () => ({
                url: "profile",
                method: "GET",
            }),
            // Attach `onQueryStarted` here if needed
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({ user: result.data.user }));
                } catch (error) {
                    console.log(error);
                }
            },
        }),

        // Update user endpoint
        updateUser: builder.mutation({
            query: (formData) => ({
                url: "profile/update",
                method: "PUT",
                body: formData,
                credentials: "include",
            }),
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation,
} = authApi;
