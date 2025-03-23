import { Badge } from '@/components/ui/badge'
import React from 'react'
import { Link } from 'react-router-dom'

const SearchResult = ({course}) => {

   const courseId="dnndnnndddd"

  return (
    <div className='flex flex-col md:flex-row  justify-between items-start md:items-center border-b border-gray-300 py-4 gap-4'>
      <Link to={`/course-details/${courseId}`} className='flex flex-col md:flex-row gap-4 w-full md:w-auto' >
      
      <img src={"https://imgs.search.brave.com/UqHjX0N1paeQ4ba0l-fAbuKriN6SzhaS9lbe7PUnTck/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdHls/ZXMucmVkZGl0bWVk/aWEuY29tL3Q1XzNo/N3lpL3N0eWxlcy9j/b21tdW5pdHlJY29u/X25zcm96aHI5aWds/OTEucG5n"} alt='course-image'
      className='h-32 w-fullmd:w-56 object-cover rounded'
      />
      <div className='flex flex-col gap-2' >
        <h1 className='text-bold text-lg md:text-xl' >Course Title</h1>
        <p className='text-sm text-gray-600' >Subtitle</p>
        <p className='text-sm text-gray-700' >Instuctor: <span className='font-bold'></span> Madhav Hirani</p>
        <Badge className="w-fit mt-2 md:mt-0" >Medium</Badge>

      </div>
      </Link>
    </div>
  )
}

export default SearchResult