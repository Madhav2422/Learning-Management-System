import { Edit } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Lecture = ({lecture,courseId,index}) => {

    const navigate=useNavigate();
    
    const gotToUpdateLecture=async()=>{
        navigate(`${lecture._id}`)
    }

  return (
   <div className='flex items-center justify-between bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py2
    rounded-md my-2'>
        <h1 className='font-bold text-gray-800 dark:text-gray-100' >
           Lecture- {index+1} : {lecture.lectureTitle}</h1>

        <Edit size={20}
         onClick={gotToUpdateLecture}
         className='cursor-pointer text-gray-600  dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-600' />
    </div>
  )
}

export default Lecture