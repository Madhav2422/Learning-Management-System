import RichTextEditor from '@/components/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
 
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEditCourseMutation } from '@/features/apis/courseApi'
import { toast } from "sonner";



const CourseTab = () => {

    //api calling for edit the course
    const [editCourse, data, isLoading, isSuccess, error] = useEditCourseMutation()

    //to receive the courseID
    const params=useParams();
    const courseId=params.courseId;
    

    const isPublished = true

    const navigate = useNavigate()

    const [input, setInput] = useState({
        courseTitle: "",
        subtitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: ""
    });
    const [previewThumbnail, setpreviewThumbnail] = useState("")

    const changeEventHandler = (e) => {
        const { name, value } = e.target
        setInput({ ...input, [name]: value })

    }


    const selectCategory = (value) => {
        setInput({ ...input, category: value })
    }

    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value })
    }


    //get file
    const selectthumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, courseThumbnail: file })

            // show the preview browser cannot get the image directly they are converted into file url
            const fileReader = new FileReader();
            fileReader.onloadend = () => setpreviewThumbnail(fileReader.result)
            fileReader.readAsDataURL(file)
        }
    }

    const updateCourse = async () => {
        const formData = new FormData()
        formData.append("courseTitle", input.courseTitle)
        formData.append("subtitle", input.subtitle)
        formData.append("description", input.description)
        formData.append("category", input.category)
        formData.append("courseLevel", input.courseLevel)
        formData.append("coursePrice", input.coursePrice)
        formData.append("courseThumbnail", input.courseThumbnail)

        const response  = await editCourse({formData,courseId})
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "Course Updated")
        }
        if (error) {
            toast.error(error.data.message || "Failed to update the course")
        }
    }, [isSuccess, error])

    return (
        <Card>
            <CardHeader classname="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic course information </CardTitle>
                    <CardDescription>
                        Make changes to your courses here.Click save when're done
                    </CardDescription>
                </div>
                <div className='space-y-2'>
                    <Button variant="outline">
                        {
                            isPublished ? "Unpublished" : "Published"
                        }
                    </Button>
                    <Button>Remove Course</Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className='space-y-4 mt-5'>
                    <div>
                        <Label>Title</Label>
                        <Input type="text" placeholder="Ex.full stack developer" name="courseTitle"
                            value={input.courseTitle}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input type="text" placeholder="Ex. Become a full stack developer from zero to hero" name="subtitle"
                            value={input.subtitle}
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
                            <Select onValueChange={selectCategory} >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="Next JS">Next JS</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="Frontend Development">
                                            Frontend Development
                                        </SelectItem>
                                        <SelectItem value="Fullstack Development">
                                            Fullstack Development
                                        </SelectItem>
                                        <SelectItem value="MERN Stack Development">
                                            MERN Stack Development
                                        </SelectItem>
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
                            <div>

                                <Select onValueChange={selectCourseLevel}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a course level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Course Level</SelectLabel>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Advanced">
                                                Advanced
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label>Prince in (INR)</Label>
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
                            onChange={selectthumbnail}
                        />
                        {
                            previewThumbnail && (
                                <img src={previewThumbnail} className='w-64 my-2' alt='Course Thumbnail' />
                            )
                        }
                    </div>
                    <div>
                        <Button onClick={() => navigate("/admin/course")} variant="outline" >Cancel</Button>
                        <Button disabled={isLoading} onClick={updateCourse} >
                            {
                                isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate spin' />
                                        Please wait
                                    </>
                                ) : (
                                    "Save"
                                )
                            }
                        </Button>
                    </div>
                </div>
            </CardContent>

        </Card>
    )
}

export default CourseTab