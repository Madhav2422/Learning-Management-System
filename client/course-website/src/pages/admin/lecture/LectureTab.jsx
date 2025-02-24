import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useEditLectureMutation, useGetLecturebyIdQuery, useRemoveLectureMutation } from '@/features/apis/courseApi'
import axios from 'axios'
import { Loader, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

//Api call
const MEDIA_URL = "http://localhost:8080/api/v1/media";



const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setbtnDisable] = useState(true);
  const params = useParams();
  const { courseId, lectureId } = params;


  //Api call to edit the lecture 
  const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();
  const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] = useRemoveLectureMutation();
  const { data: lectureData } = useGetLecturebyIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
       setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.uploadVideoInfo);
    }
  }, [lecture])

  //Edit the lecture

  const editLectureHandler = async () => {
    await editLecture({ lectureTitle, videoInfo: uploadVideoInfo, isPreviewFree: isFree, courseId, lectureId })
  }

  //Remove lecture
  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
  }

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData.message)
    }
  }, [removeSuccess])

  useEffect(() => {

    if (isSuccess) {
      toast.success(data.message);
    }
    if (error) {
      toast.error(data.error);
    }

  }, [isSuccess, error])

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_URL}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          console.log(res);
          setUploadVideoInfo({ videoUrl: res.data.data.url, publicId: res.data.data.public_id })
          setbtnDisable(false);
          toast.success(res.data.message);
        }

      } catch (error) {
        console.error("Upload error", error);
        console.log(error);
        toast.error("video upload failed");
      }
      finally {
        setMediaProgress(false);
      }

    }
  };



  return (
    <Card>
      <CardHeader className='flex justify-between'>
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>Make changes and click save when done </CardDescription>
        </div>
        <div className='flex items-center gap-2'>
          <Button disabled={removeLoading} onClick={removeLectureHandler} variant='destructive'>{
            removeLoading ? <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />Please Wait
            </> : "Remove Lecture"
          }</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            type='text'
            placeholder='Ex.Introduction to Java'
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>
        <div className='my-5'>
          <Label>Video <span className='text-red-500'>*</span> </Label>
          <Input
            type='file'
            accept="video/*"
            className='w-fit'
            onChange={fileChangeHandler}
          />
        </div>

        <div className='flex items-center space-x-2 my-5'>
          <Switch checked={isFree} onCheckedChange={setIsFree} id="airplane-mode" />
          <Label htmlFor="airplane-mode">Is this video FREE</Label>
        </div>

        {
          mediaProgress && (
            <div className='my-5'>
              <Progress value={uploadProgress} />
              <p>{uploadProgress} % uploaded</p>
            </div>
          )
        }

        <div className='mt-4'>
          <Button disabled={isLoading} onClick={editLectureHandler} >
            {
              isLoading ? <>
                <Loader2 className='mr-2 h-4 w-4 animate spin' />Please Wait
              </> : "Update lecture "
            }
          </Button>
        </div>

      </CardContent>
    </Card>
  )

}
export default LectureTab