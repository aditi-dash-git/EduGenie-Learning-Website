import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import { setAuthToken } from "./utils/axiosInstance";

/* Auth */
// import LoginPage from "./pages/Auth/LoginPage";
// import RegisterPage from "./pages/Auth/RegisterPage";

import { SignIn, SignUp, useUser } from "@clerk/react";

/* Layouts */
// import MainLayout from "./components/layout/MainLayout"; // ❗ NEW (No Sidebar)
import StudentLayout from "./components/layout/StudentLayout"; // Dashboard Layout
// import EducatorLayout from "./components/layout/EducatorLayout";

/* Protected */
import ProtectedRoute from "./components/auth/ProtectedRoute";
// import EducatorRoute from "./components/auth/EducatorRoute";

/* Student Pages */
import HomePage from "./pages/Courses/HomePage";
import CourseList from "./pages/Courses/CourseList";
import CourseDetails from "./pages/Courses/CourseDetails";
import MyEnrollments from "./pages/Courses/MyEnrollments";
import PlayerPage from "./pages/Courses/PlayerPage";

import DashboardPage from "./pages/Dashboard/DashboardPage";
import DocumentListPage from "./pages/Documents/DocumentListPage";
import DocumentDetailPage from "./pages/Documents/DocumentDetailPage";
import FlashcardsListPage from "./pages/Flashcards/FlashcardsListPage";
import FlashcardPage from "./pages/Flashcards/FlashcardPage";
import QuizTakePage from "./pages/Quizzes/QuizTakePage";
import QuizResultPage from "./pages/Quizzes/QuizResultPage";
import ProfilePage from "./pages/Profile/ProfilePage";

/* Educator Pages */
import DashBoard from "./pages/Educator/DashBoard";
import AddCourse from "./pages/Educator/AddCourse";
import MyCourses from "./pages/Educator/MyCourses";
import StudentsEnrolled from "./pages/Educator/StudentsEnrolled";

/* Other */
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/layout/Header";
import Educator from "./pages/Educator/Educator";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import Loading from "./components/courses/Loading";

const App = () => {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();
  const { getToken } = useAuth();

  const isEducatorRoute = location.pathname.startsWith("/educator");

  const isStudentDashboard =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/documents") ||
    location.pathname.startsWith("/flashcards") ||
    location.pathname.startsWith("/quizzes") ||
    location.pathname.startsWith("/profile");

  useEffect(() => {
    const loadToken = async () => {
      console.log("SIGNED IN:", isSignedIn);
      if (isSignedIn) {
        const token = await getToken();
        console.log("CLERK TOKEN:", token);
        setAuthToken(token);
      }
    };
    loadToken();
  }, [isSignedIn]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
      {!isEducatorRoute && !isStudentDashboard && <Header />}
      {/* <Header /> */}
      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        {/* Auth */}
        <Route
          path="/sign-in/*"
          element={<SignIn routing="path" path="/sign-in" />}
        />

        <Route
          path="/sign-up/*"
          element={<SignUp routing="path" path="/sign-up" />}
        />

        {/* ================= MAIN (NO SIDEBAR) ================= */}
        {/* <Route element={<ProtectedRoute />}> */}
        {/* <Route element={<MainLayout />}> */}
        {/* <Route path="/home" element={<HomePage />} />
          <Route path="/course-list" element={<CourseList />} />
          <Route path="/course-list/:input" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/watch/:courseId" element={<PlayerPage />} />
          <Route path="/my-enrollments" element={<MyEnrollments />} /> */}
        {/* </Route> */}
        {/* </Route> */}

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/home" element={<HomePage />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetails />} />

        {/* ================= PROTECTED ROUTES ================= */}

        <Route element={<ProtectedRoute />}>
          <Route path="/watch/:courseId" element={<PlayerPage />} />
          <Route path="/my-enrollments" element={<MyEnrollments />} />
        </Route>

        {/* ================= DASHBOARD (WITH SIDEBAR) ================= */}
        <Route element={<ProtectedRoute />}>
          <Route element={<StudentLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/documents" element={<DocumentListPage />} />
            <Route path="/documents/:id" element={<DocumentDetailPage />} />
            <Route path="/flashcards" element={<FlashcardsListPage />} />
            <Route
              path="/documents/:id/flashcards"
              element={<FlashcardPage />}
            />
            <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
            <Route
              path="/quizzes/:quizId/results"
              element={<QuizResultPage />}
            />
            <Route path="/profile" element={<ProfilePage />} />
            {/* </Route> */}
          </Route>
        </Route>
        {/* ================= EDUCATOR ================= */}
        <Route element={<ProtectedRoute />}>
          {/* <Route element={<EducatorRoute />}> */}
          {/* <Route element={<EducatorLayout />}> */}
          <Route path="/educator" element={<Educator />}>
            <Route path="/educator" element={<DashBoard />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="student-enrolled" element={<StudentsEnrolled />} />
          </Route>
        </Route>
        {/* </Route> */}
        {/* 404 */}
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
