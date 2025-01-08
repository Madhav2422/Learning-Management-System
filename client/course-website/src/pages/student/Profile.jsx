import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

const Profile = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 my-10">
            <h1 className='font-bold text-2xl text-center md:text-left'>Profile</h1>
            <div className='flex flex-col md:flex-row items-center md:items-start gap-8 my-5 '>
                <div  className='flex flex-col items-center' >
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <div className='mb-2'>
                        <h1 className='font-semibold text-gray-900 dark:text-gray-200'>
                        Name:
                        <span className='font-normal text-gray-700 dark:text-gray-300 ml-2 '>Madhav Hirani</span></h1>
                    </div>
                    <div className='mb-2'>
                        <h1 className='font-semibold text-gray-900 dark:text-gray-200'>
                        Email:
                        <span className='font-normal text-gray-700 dark:text-gray-300 ml-2 '>mrhirani24@gmail.com</span></h1>
                    </div>
                    <div className='mb-2'>
                        <h1 className='font-semibold text-gray-900 dark:text-gray-200'>
                        Role:
                        <span className='font-normal text-gray-700 dark:text-gray-300 ml-2 '>Student</span></h1>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Profile