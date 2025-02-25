import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { BadgeInfo, PlayCircle } from 'lucide-react'
import React from 'react'
import Lecture from '../admin/lecture/Lecture'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import BuyCourseButton from '@/components/BuyCourseButton'

const CourseDetail = () => {

    const purchasedCourse = true;

    return (
        <div>
            <div className='bg-[#2D2F31] text-white'>
                <div className='max-w-7xl mx-auto flex flex-col gap-2 py-8 px-4 md:px-8'>
                    <h1 className='font bold text-2xl md:text-3xl'>Course Title</h1>
                    <p className='text-base md:text-lg' >Course Sub-title</p>
                    <p >Created by -{""} <span className='text-[#C0C4FC] underline italic' >Madhav Hirani</span> </p>

                    <div className='flex items-center gap-2 text-sm'>
                        <BadgeInfo size={16} />
                        <p>Last updated 11-11-2024</p>
                    </div>
                    <p>Students enrolled:10</p>
                </div>
            </div>
            <div className='mx-2-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10'>
                <div className='w-full lg:w-1/2 space-y-5'>
                    <h1 className='font-bold text-xl md:text-2xl'>Description</h1>
                    <p className='text-sm'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium aliquam distinctio cum dolorum harum architecto nemo doloremque similique, error ut facilis vel! Minima.</p>
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>
                                4 lectures
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {
                                [1, 2, 3].map((_, index) => (
                                    <div key={index} className='flex items-center gap-3 text-sm'>
                                        <span>
                                            {
                                                true ? <PlayCircle size={14} /> : <Lock size={14} />
                                            }
                                        </span>
                                        <p>Lecture Title</p>
                                        <p></p>
                                    </div>
                                ))
                            }
                        </CardContent>
                    </Card>
                </div>
                <div className='w-full lg:w-1/3'>
                    <Card>
                        <CardContent className='p-4 flex flex-col'>
                            <div className=' w-full aspect-video mb-4'>
                                React player  Video
                            </div>
                            <h1>Lecture Title</h1>
                            <Separator className='my-2' />
                            <h1 className='text-lg md:ext-xl font-semibold' >Course Price</h1>
                        </CardContent>

                        <CardFooter className='flex justify-center p-4'>
                            {
                                purchasedCourse ? (
                                    <Button className='w-full'>Continue Course</Button>) :
                                    (<BuyCourseButton />

                                    )
                            }

                        </CardFooter>


                    </Card>

                </div>
            </div>
        </div>

    )
}

export default CourseDetail