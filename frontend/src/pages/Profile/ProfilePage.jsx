import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";

import {
  User,
  Mail,
  ShieldCheck,
  Settings,
} from "lucide-react";

import {
  useUser,
  UserProfile,
} from "@clerk/react";

const ProfilePage = () => {
  const { user, isLoaded } =
    useUser();

  const [showProfile, setShowProfile] =
    useState(false);

  if (!isLoaded) {
    return <Spinner />;
  }

  return (
    <>
      <div className="relative min-h-screen">

        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#dbeafe_1px,transparent_1px)] bg-[size:16px_16px] opacity-25 pointer-events-none" />

        <div className="relative">
          <PageHeader title="Profile Settings" />

          <div className="space-y-8">

            {/* User Information Card */}
            <div className="bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-2xl shadow-blue-100/20 overflow-hidden">

              {/* Header */}
              <div className="px-8 py-6 border-b border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/60">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/25 flex items-center justify-center">

                    <User
                      className="w-7 h-7 text-white"
                      strokeWidth={2}
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      User Information
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Your account details
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">

                {/* Username */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-2">
                    Username
                  </label>

                  <div className="relative">

                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                      <User className="h-5 w-5 text-blue-500" />
                    </div>

                    <input
                      type="text"
                      value={
                        user?.fullName || ""
                      }
                      readOnly
                      className="w-full h-12 pl-12 pr-4 border border-blue-100 rounded-2xl bg-blue-50/50 text-sm font-medium text-slate-700 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-2">
                    Email Address
                  </label>

                  <div className="relative">

                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                      <Mail className="h-5 w-5 text-blue-500" />
                    </div>

                    <input
                      type="email"
                      value={
                        user
                          ?.primaryEmailAddress
                          ?.emailAddress ||
                        ""
                      }
                      readOnly
                      className="w-full h-12 pl-12 pr-4 border border-blue-100 rounded-2xl bg-blue-50/50 text-sm font-medium text-slate-700 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                {/* Clerk ID */}
                {/* <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-2">
                    Clerk User ID
                  </label>

                  <div className="relative">

                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                      <ShieldCheck className="h-5 w-5 text-blue-500" />
                    </div>

                    <input
                      type="text"
                      value={
                        user?.id || ""
                      }
                      readOnly
                      className="w-full h-12 pl-12 pr-4 border border-blue-100 rounded-2xl bg-blue-50/50 text-sm font-medium text-slate-700 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div> */}
              </div>
            </div>

            {/* Account Management */}
            <div className="bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-2xl shadow-blue-100/20 overflow-hidden">

              {/* Header */}
              <div className="px-8 py-6 border-b border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/60">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/25 flex items-center justify-center">

                    <Settings
                      className="w-7 h-7 text-white"
                      strokeWidth={2}
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Account Management
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Securely manage your account
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Your authentication,
                  passwords, connected
                  accounts, and security
                  settings are securely
                  managed by Clerk.
                </p>

                <button
                  onClick={() =>
                    setShowProfile(true)
                  }
                  className="group relative px-7 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-sm rounded-2xl transition-all duration-200 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.98] overflow-hidden"
                >

                  <span className="relative z-10 flex items-center gap-2">

                    <Settings
                      className="w-4 h-4"
                      strokeWidth={2.5}
                    />

                    Manage Account
                  </span>

                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clerk Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">

          <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-6xl w-full h-[92vh] border border-blue-100">

            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Manage Your Account
                </h2>

                <p className="text-sm text-slate-500">
                  Update your profile,
                  security and preferences
                </p>
              </div>

              {/* Close */}
              <button
                onClick={() =>
                  setShowProfile(false)
                }
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-xl font-semibold"
              >
                ×
              </button>
            </div>

            {/* Clerk Profile */}
            <div className="h-[calc(92vh-81px)] overflow-auto bg-slate-50">

              <UserProfile
                routing="hash"
                appearance={{
                  variables: {
                    colorPrimary:
                      "#2563eb",
                    colorText:
                      "#0f172a",
                    colorBackground:
                      "#ffffff",
                    colorInputBackground:
                      "#f8fafc",
                    colorInputText:
                      "#0f172a",
                    borderRadius:
                      "1rem",
                  },

                  elements: {
                    rootBox:
                      "w-full h-full",
                    card:
                      "shadow-none border-0 w-full rounded-none",
                    navbar:
                      "bg-slate-50 border-r border-slate-200",
                    navbarButton:
                      "hover:bg-blue-50 hover:text-blue-700",
                    navbarButtonActive:
                      "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg",
                    headerTitle:
                      "text-slate-900 font-bold",
                    headerSubtitle:
                      "text-slate-500",
                    formButtonPrimary:
                      "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg rounded-xl",
                    profileSectionTitle:
                      "text-slate-900 font-semibold",
                    profileSectionContent:
                      "text-slate-600",
                    formFieldInput:
                      "rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-blue-500",
                    footerActionLink:
                      "text-blue-600 hover:text-blue-700",
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;