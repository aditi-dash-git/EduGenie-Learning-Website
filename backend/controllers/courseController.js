import Course from "../models/Course.js";
import User from "../models/User.js";

// Get All Courses
export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).select(
      "-courseContent -enrolledStudents",
    );

    const coursesWithEducator = await Promise.all(
      courses.map(async (course) => {
        console.log("Course educator ID:", course.educator);
        const educator = await User.findOne(
          { clerkId: course.educator },
          "name imageUrl",
        );

        console.log("Educator found:", educator);

        return {
          ...course._doc,
          educator,
        };
      }),
    );

    res.json({
      success: true,
      courses: coursesWithEducator,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Course by ID
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Clone object (avoid mutation issues)
    const courseData = course.toObject();

    // 🔥 attach educator manually (since clerkId is string)
    const educator = await User.findOne(
      { clerkId: course.educator },
      "name imageUrl",
    );

    courseData.educator = educator;

    // 🔒 Hide non-preview lecture URLs
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    // courseData.courseContent?.forEach((chapter) => {
    //   chapter.chapterContent?.forEach((lecture) => {
    //     if (!lecture.isPreviewFree) {
    //       lecture.lectureUrl = "";
    //     }
    //   });
    // });

    res.json({
      success: true,
      courseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
