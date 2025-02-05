import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetCreatorCourseQuery } from '@/features/apis/courseApi'
import { Edit } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'


const CourseTable = () => {

  const { data, isLoading } = useGetCreatorCourseQuery()
  const navigate = useNavigate()

  if (isLoading) return <h1>Loading..</h1>
  console.log(data)

  return (
    <div>

      <Button onClick={() => navigate(`create`)} >Create a new course</Button>
      <Table>
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="font-medium">{course?.price || "NA"}</TableCell>
              <TableCell> {course.isPublished?"Published":"Draft"}</TableCell>
              <TableCell>{course?.courseTitle}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" ><Edit /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


    </div>
  )
}

export default CourseTable