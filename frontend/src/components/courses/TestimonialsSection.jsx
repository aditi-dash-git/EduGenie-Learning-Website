import React from "react";
import { assets, dummyTestimonial } from "../../assets/assets";

const TestimonialsSection = () => {
  return (
    <div className="pb-14 px-4 md:px-0 max-w-6xl mx-auto text-center">
      <h2 className="text-4xl font-semibold text-gray-800">Testimonials</h2>

      <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
        Hear from our learners as they share their journeys of transformation,
        success, and how our platform has made a difference in their lives.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-14">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="text-sm text-left border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-4 px-5 py-5 bg-gray-100">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h1 className="text-lg font-medium text-gray-800">
                  {testimonial.name}
                </h1>
                <p className="text-gray-500">{testimonial.role}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="h-5"
                    src={
                      i < Math.floor(testimonial.rating)
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                  />
                ))}
              </div>

              <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
              <a
                href="#"
                className="inline-block mt-4 text-sm text-blue-400 hover:text-blue-600 underline"
              >
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
