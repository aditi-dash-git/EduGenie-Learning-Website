import React from "react";
import { Routes, Route, Navigate, useMatch } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

/* Auth */
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

/* Layouts */
import MainLayout from "./components/layout/MainLayout"; // ❗ NEW (No Sidebar)
import StudentLayout from "./components/layout/StudentLayout"; // Dashboard Layout
import EducatorLayout from "./components/layout/EducatorLayout";

/* Protected */
import ProtectedRoute from "./components/auth/ProtectedRoute";
import EducatorRoute from "./components/auth/EducatorRoute";

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
  const { isAuthenticated, loading } = useAuth();
  const isEducatorRoute = useMatch("/educator/*");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
      {!isEducatorRoute && <Header />}
      {/* <Header /> */}
      <Routes>
        {/* Default Redirect */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* ================= MAIN (NO SIDEBAR) ================= */}
        <Route element={<ProtectedRoute />}>
          {/* <Route element={<MainLayout />}> */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/course-list" element={<CourseList />} />
          <Route path="/course-list/:input" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/watch/:courseId" element={<PlayerPage />} />
          <Route path="/my-enrollments" element={<MyEnrollments />} />
          {/* </Route> */}
        </Route>
        {/* ================= DASHBOARD (WITH SIDEBAR) ================= */}
        <Route element={<ProtectedRoute />}>
          {/* <Route element={<StudentLayout />}> */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/flashcards" element={<FlashcardsListPage />} />
          <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* </Route> */}
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
        <Route path="/home/loading/:path" element={<Loading />} />{" "}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
