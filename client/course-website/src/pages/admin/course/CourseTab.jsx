import RichTextEditor from '@/components/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
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
import { useNavigate } from 'react-router-dom'

const CourseTab = () => {
    
    const isPublished = true
    const isLoading=false;
    const navigate=useNavigate()

    const [input, setInput] = useState({
        courseTitle: "",
        subtitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: ""
    });

    const changeEventHandler = (e) => {
        const { name, value } = e.target
        setInput({ ...input, [name]: value })

    }



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
                            onchange={changeEventHandler}
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input type="text" placeholder="Ex. Become a full stack developer from zero to hero" name="subtitle"
                            value={input.subtitle}
                            onchange={changeEventHandler}
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className='flex items-center gap-5'>
                        <div>
                            <Label>Category</Label>
                            <Select>
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

                                <Select>
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
                        />
                    </div>
                    <div>
                        <Button onClick={()=> navigate("/admin/course") } variant="outline" >Cancel</Button>
                        <Button disabled={isLoading} >
                            {
                                isLoading?(
                                    <>
                                    <Loader2 className='mr-2 h-4 w-4 animate spin'/>
                                    Please wait 
                                    </>
                                ):(
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