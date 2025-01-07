import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Badge } from "@/components/ui/badge"
import React from 'react'

const Course = () => {


    return (
        <>
            <Card classname='overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl 
     trasnsform hover:scale-105 transition-all duration-300'>
                <div>
                    <div className='relative'>
                        <img className='w-full h-36 object-cover rounded-t-lg'
                            src='https://imgs.search.brave.com/XO7bA9hM7-W-jjKBF1htfj8aoUC-JsYk8841NLstdCM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZWVrc2Zvcmdl/ZWtzLm9yZy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNDEyMTcw/OTQyNTY3ODk2MDgv/Qy1UdXRvcmlhbC5w/bmc'
                            alt='Course' />

                    </div>
                    <CardContent className="px-5 py-4 space-y-3">
                        <h1 className="hover:underline font-bold text-lg truncate">
                            C Language Course
                        </h1>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h1 className="font-medium text-sm">Shyam Sir</h1>
                            </div>
                            <Badge className={'bg-blue-600 text-white px-2 py-1 text-xs rounded-full'}>
                                Beginner
                            </Badge>
                        </div>
                        <div className="text-lg font-bold">
                            <span>₹1000</span>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </>
    )
}

export default Course