import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8080/api/v1/course";

export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes: ["Refetch_Creator_Course", "Refectch_Lecture"],
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category }) => ({
                url: "",
                method: "POST",
                body: { courseTitle, category },
            }),
            invalidatesTags: ['Refetch_Creator_Course']
        }),
        getPublishedCourses: builder.query({
            query: () => ({
                url: "/published-courses",
                method: "GET",

            })
        }),
        getCreatorCourse: builder.query({
            query: () => ({
                url: "",
                method: "GET",
            }),
            providesTags: ['Refetch_Creator_Course']
        }),
        editCourse: builder.mutation({
            query: ({ formData, courseId }) => ({
                url: `/${courseId}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ['Refetch_Creator_Course']
        }),

        getCourseByID: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "GET"
            }),
        }),

        createLecture: builder.mutation({
            query: ({ lectureTitle, courseId }) => ({
                url: `/${courseId}/lecture`,
                method: "POST",
                body: { lectureTitle }
            }),
        }),

        getCourseLecture: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lecture`,
                method: "GET",

            }),
            providesTags: ['Refectch_Lecture']
        }),
        editLecture: builder.mutation({
            query: ({ lectureTitle, videoInfo, isPreviewFree, courseId, lectureId }) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: "POST",
                body: { lectureTitle, videoInfo, isPreviewFree }
            })
        }),
        removeLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Refetch_Lecture"]
        }),
        getLecturebyId: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "GET"
            })
        }),
        publishCourse: builder.mutation({
            query: ({ courseId, query }) => ({
                url: `/${courseId}?publish=${query}`,
                method: "PATCH",
            }),
        }),
        getSearchCourses: builder.query({
            query: ({ categories, searchQuery, sortByPrice }) => {
                //Build query string 
                let queryString = `/search?query= ${encodeURIComponent(searchQuery)}`;

                //Append category
                if (categories && categories.length > 0) {
                    const categoriesString = categories.map(encodeURIComponent).join(",")
                    queryString += `&categories=${categoriesString}`;
                }
                //Append sort by price  if Available 
                if (sortByPrice) {
                    queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
                }

                return {
                    url: queryString,
                    method: "GET"

                }

            },
        }),

    }),
});

export const { useCreateCourseMutation, useGetPublishedCoursesQuery, useGetCreatorCourseQuery, useEditCourseMutation, useGetCourseByIDQuery, useCreateLectureMutation, useGetCourseLectureQuery, useEditLectureMutation, useRemoveLectureMutation, useGetLecturebyIdQuery, usePublishCourseMutation,useGetSearchCoursesQuery} = courseApi;
