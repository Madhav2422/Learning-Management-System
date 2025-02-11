import { Course } from "../models/courseModel.js";
import{deleteMediaFromCloudinary, uploadMedia} from "../utils/cloudinary.js"

export const createCourse=async(req,res)=>{
    try {
        const {courseTitle,category}=req.body

        if(!courseTitle || !category){
            return res.status(400).json({
                message:"Course Title and category are required"
            })
        }

        const course=await Course.create({
            courseTitle,
            category,
            creator:req.id
        })

        return res.status(201).json({
            course,
            message:"Course created "
        })

    } catch (error) {
        
        console.log(error);

        return res.status(500).json({
            message:"Failed to create Course"
        })
    }
}

//Api for getting all the creator courses
export const getCreatorCourses=async(req,res)=>{

    try {
        
        const userId=req.id;
        const courses=await Course.find({creator:userId})

        if(!courses){
            return res.status(404).json({
                courses:[],
                message:"Course not found"
            })
        };
       
        return res.status(200).json({
            courses,
         })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
        message:"Failed to get all the courses"
    })
}
}

// api for edit course 
export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        let courseThumbnail = course.courseThumbnail; // Default to existing thumbnail

        if (thumbnail) {
            if (course.courseThumbnail) {
                try {
                    const thumbnailUrlParts = course.courseThumbnail.split("/");
                    const publicId = thumbnailUrlParts.pop().split(".")[0];
                    await deleteMediaFromCloudinary(publicId); // Delete old image
                } catch (err) {
                    console.log("Error deleting old image:", err);
                }
            }

            // Upload new thumbnail
            const uploadedMedia = await uploadMedia(thumbnail.path);
            if (!uploadedMedia || !uploadedMedia.secure_url) {
                return res.status(500).json({
                    message: "Failed to upload new thumbnail"
                });
            }
            courseThumbnail = uploadedMedia.secure_url;
        }

        // Updated data
        const updatedData = { courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail };

        course = await Course.findByIdAndUpdate(courseId, updatedData, { new: true });

        return res.status(200).json({
            course,
            message: "Course updated successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update the course"
        });
    }
};
