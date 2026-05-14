import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import progressService from "../../services/progressService";
import { useAuth } from "@clerk/react";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock,
} from "lucide-react";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchDashboardData =
      async () => {
        try {
          const token =
            await getToken();

          const data =
            await progressService.getDashboardData(
              token
            );

          console.log(
            "Data__getDashboardData",
            data
          );

          setDashboardData(data.data);
        } catch (error) {
          toast.error(
            "Failed to fetch dashboard data."
          );

          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (
    !dashboardData ||
    !dashboardData.overview
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 mb-4 shadow-lg shadow-blue-100/50">
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>

          <p className="text-slate-600 text-sm font-medium">
            No dashboard data available.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Documents",
      value:
        dashboardData.overview
          .totalDocuments,
      icon: FileText,
      gradient:
        "from-blue-500 to-cyan-500",
      shadowColor:
        "shadow-blue-500/25",
    },

    {
      label: "Total Flashcards",
      value:
        dashboardData.overview
          .totalFlashcards,
      icon: BookOpen,
      gradient:
        "from-indigo-500 to-purple-500",
      shadowColor:
        "shadow-indigo-500/25",
    },

    {
      label: "Total Quizzes",
      value:
        dashboardData.overview
          .totalQuizzes,
      icon: BrainCircuit,
      gradient:
        "from-cyan-500 to-sky-500",
      shadowColor:
        "shadow-cyan-500/25",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#dbeafe_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Dashboard
          </h1>

          <p className="text-slate-500 text-sm">
            Track your learning
            progress and activity
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {stats.map(
            (stat, index) => (
              <div
                key={index}
                className="group relative bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-xl shadow-blue-100/20 p-6 hover:shadow-2xl hover:shadow-blue-200/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-indigo-500/[0.02] to-cyan-500/[0.03] opacity-0 group-hover:opacity-100 transition-all duration-300" />

                <div className="relative z-10 flex items-center justify-between mb-5">

                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {stat.label}
                  </span>

                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg ${stat.shadowColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon
                      className="w-5 h-5 text-white"
                      strokeWidth={2}
                    />
                  </div>
                </div>

                <div className="relative z-10 text-4xl font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </div>

                {/* Bottom Accent */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-all duration-300`}
                />
              </div>
            )
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-xl shadow-blue-100/20 p-8 overflow-hidden relative">

          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-indigo-500/[0.01] to-cyan-500/[0.02]" />

          <div className="relative z-10">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 flex items-center justify-center">

                <Clock
                  className="w-6 h-6 text-white"
                  strokeWidth={2}
                />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Recent Activity
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Your latest learning
                  updates
                </p>
              </div>
            </div>

            {dashboardData
              .recentActivity &&
            (dashboardData
              .recentActivity
              .documents.length >
              0 ||
              dashboardData
                .recentActivity
                .quizzes.length >
                0) ? (

              <div className="space-y-4">

                {[
                  ...(
                    dashboardData
                      .recentActivity
                      .documents || []
                  ).map((doc) => ({
                    id: doc._id,
                    description:
                      doc.title,
                    timestamp:
                      doc.lastAccessed,
                    link: `/documents/${doc._id}`,
                    type: "document",
                  })),

                  ...(
                    dashboardData
                      .recentActivity
                      .quizzes || []
                  ).map((quiz) => ({
                    id: quiz._id,
                    description:
                      quiz.title,
                    timestamp:
                      quiz.lastAttempted,
                    link: `/quizzes/${quiz._id}`,
                    type: "quiz",
                  })),
                ]
                  .sort(
                    (a, b) =>
                      new Date(
                        b.timestamp
                      ) -
                      new Date(
                        a.timestamp
                      )
                  )

                  .map(
                    (
                      activity,
                      index
                    ) => (
                      <div
                        key={
                          activity.id ||
                          index
                        }
                        className="group flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/20 transition-all duration-300"
                      >
                        <div className="flex-1 min-w-0">

                          <div className="flex items-center gap-3 mb-2">

                            <div
                              className={`w-3 h-3 rounded-full ${
                                activity.type ===
                                "document"
                                  ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                  : "bg-gradient-to-r from-indigo-500 to-purple-500"
                              }`}
                            />

                            <p className="text-sm font-semibold text-slate-900 truncate">

                              {activity.type ===
                              "document"
                                ? "Accessed Document:"
                                : "Attempted Quiz:"}

                              <span className="ml-1 text-slate-600 font-medium">
                                {
                                  activity.description
                                }
                              </span>
                            </p>
                          </div>

                          <p className="text-xs text-slate-500 pl-6">
                            {new Date(
                              activity.timestamp
                            ).toLocaleString()}
                          </p>
                        </div>

                        {activity.link && (
                          <a
                            href={
                              activity.link
                            }
                            className="ml-4 px-5 h-10 inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 active:scale-[0.98]"
                          >
                            View
                          </a>
                        )}
                      </div>
                    )
                  )}
              </div>
            ) : (

              <div className="text-center py-16">

                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-100 to-indigo-100 mb-6 shadow-lg shadow-blue-100/50">

                  <Clock className="w-10 h-10 text-blue-500" />
                </div>

                <p className="text-base font-semibold text-slate-700">
                  No recent activity yet.
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Start learning to
                  see your progress
                  here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;