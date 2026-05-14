import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  return (
    <Link
      to={"/courses/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-2xl hover:shadow-blue-100/40 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Course Image */}
      <div className="w-full h-52 bg-slate-100 flex items-center justify-center overflow-hidden">
        <img
          src={course.courseThumbnail}
          alt=""
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 min-h-[56px]">
          {course.courseTitle}
        </h3>

        {/* Educator */}
        <p className="text-sm text-slate-500 mt-1">
          {course.educator?.name || "Unknown Instructor"}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-3">
          <p className="text-sm font-semibold text-blue-600">
            {calculateRating(course)}
          </p>

          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculateRating(course))
                    ? assets.star
                    : assets.star_blank
                }
                alt=""
                className="w-3.5 h-3.5"
              />
            ))}
          </div>

          <p className="text-xs text-slate-500">
            ({course.courseRatings.length})
          </p>
        </div>

        {/* Price */}
        <div className="mt-auto pt-4">
          <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {currency}

            {(
              course.coursePrice -
              (course.discount * course.coursePrice) / 100
            ).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
