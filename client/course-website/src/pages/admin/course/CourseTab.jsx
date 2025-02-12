import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';

import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import { useEditCourseMutation, useGetCourseByIDQuery } from '@/features/apis/courseApi';

const CourseTab = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();

    const [input, setInput] = useState({
        courseTitle: "",
        coursesubtitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: ""
    });

    const [previewThumbnail, setPreviewThumbnail] = useState("");

    // API calls (must be called unconditionally)
    const { data: coursebyIddata, isLoading: coursebyIdLoading } = useGetCourseByIDQuery(courseId);
    const [editCourse, { isLoading, isSuccess, error, data }] = useEditCourseMutation();

    // Populate form when course data changes
    useEffect(() => {
        if (coursebyIddata?.course) {
            const course = coursebyIddata.course;
            setInput((prev) => ({
                ...prev,
                courseTitle: course.courseTitle || "",
                coursesubtitle: course.coursesubtitle || "",
                description: course.description || "",
                category: course.category || "",
                courseLevel: course.courseLevel || "",
                coursePrice: course.coursePrice || "",
                courseThumbnail: ""
            }));
        }
    }, [coursebyIddata]);

    // Handle toast messages
    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Course Updated");
        }
        if (error) {
            toast.error(error?.data?.message || "Failed to update the course");
        }
    }, [isSuccess, error, data]);

    // Show loading spinner while fetching data
    if (coursebyIdLoading) return <Loader2 className='h-4 w-4 animate-spin' />;

    // Handle input change
    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const selectCategory = (value) => setInput((prev) => ({ ...prev, category: value }));
    const selectCourseLevel = (value) => setInput((prev) => ({ ...prev, courseLevel: value }));


    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput((prev) => ({ ...prev, courseThumbnail: file }));

            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    };


    const updateCourse = async () => {
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("coursesubtitle", input.coursesubtitle);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("courseLevel", input.courseLevel);
        formData.append("coursePrice", input.coursePrice);
        formData.append("courseThumbnail", input.courseThumbnail);

        await editCourse({ formData, courseId });
        // if (response.data) {
        //     navigate('/admin/course');
        // }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make changes to your course here. Click save when you're done.
                    </CardDescription>
                </div>
                <div className='space-y-2'>
                    <Button variant="outline">Published</Button>
                    <Button>Remove Course</Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className='space-y-4 mt-5'>
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            placeholder="Ex. Full Stack Developer"
                            name="courseTitle"
                            value={input.courseTitle}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            placeholder="Ex. Become a full stack developer from zero to hero"
                            name="coursesubtitle"
                            value={input.coursesubtitle}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className='flex items-center gap-5'>
                        <div>
                            <Label>Category</Label>
                            <Select onValueChange={selectCategory} value={input.category}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="Next JS">Next JS</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                                        <SelectItem value="Fullstack Development">Fullstack Development</SelectItem>
                                        <SelectItem value="MERN Stack Development">MERN Stack Development</SelectItem>
                                        <SelectItem value="Javascript">Javascript</SelectItem>
                                        <SelectItem value="Python">Python</SelectItem>
                                        <SelectItem value="Docker">Docker</SelectItem>
                                        <SelectItem value="MongoDB">MongoDB</SelectItem>
                                        <SelectItem value="HTML">HTML</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Course Level</Label>
                            <Select onValueChange={selectCourseLevel} value={input.courseLevel}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a course level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Course Level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Price in (INR)</Label>
                            <Input
                                type="number"
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                placeholder="2000"
                                className='w-fit'
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Course Thumbnail</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={selectThumbnail}
                        />
                        {previewThumbnail && (
                            <img src={previewThumbnail} className='w-64 my-2' alt='Course Thumbnail' />
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => navigate("/admin/course")} variant="outline">Cancel</Button>
                        <Button disabled={isLoading} onClick={updateCourse}>
                            {isLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait
                                </>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CourseTab;
