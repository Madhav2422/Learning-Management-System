import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = "http://localhost:8080/api/v1/purchase";

export const purchaseApi = createApi({
    reducerPath: "purchaseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_PURCHASE_API,
        credentials: "include",
    }),

    endpoints: (builder) => ({
        getCourseDetailWithStatus: builder.query({
            query: (courseId) => ({
                url: `/course/${courseId}/detail-with-status`,
                method: "GET",
            }),

        }),
        getPurchasedCourses: builder.query({
            query: () => ({
                url: `/`,
                method: "GET",
            }),
        }),

    })
})

export const {
    useGetCourseDetailWithStatusQuery,useGetPurchasedCoursesQuery
}=purchaseApi