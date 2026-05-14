import React from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Upload PDFs",
    description: "Upload study materials and access them anytime.",
    icon: "📘",
  },
  {
    title: "AI Chat",
    description: "Chat directly with your study documents using AI.",
    icon: "💬",
  },
  {
    title: "Flashcards",
    description: "Generate smart flashcards instantly from PDFs.",
    icon: "🧠",
  },
  {
    title: "Quiz Generator",
    description: "Test your knowledge with AI-generated quizzes.",
    icon: "📝",
  },
];

const AIAssistantSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-24 bg-cyan-50">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center">
          <h2 className="text-5xl font-semibold text-slate-800">
            AI Learning Assistant
          </h2>

          <p className="mt-5 text-slate-600 max-w-3xl mx-auto text-lg">
            Learn smarter with AI-powered tools that help you summarize,
            understand, revise, and test your knowledge from uploaded study
            materials.
          </p>
        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition duration-300"
            >
              <div className="text-4xl">{feature.icon}</div>

              <h3 className="mt-5 text-xl font-semibold text-slate-800">
                {feature.title}
              </h3>

              <p className="mt-3 text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}

        </div>

        {/* CTA */}

        <div className="flex justify-center mt-16">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg text-lg font-medium transition"
          >
            Open AI Dashboard
          </button>
        </div>

      </div>
    </section>
  );
};

export default AIAssistantSection;