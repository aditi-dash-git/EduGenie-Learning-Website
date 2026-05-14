import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full">

      {/* Tabs Header */}
      <div className="relative mb-6">
        <div className="flex flex-wrap gap-3 bg-white/70 backdrop-blur-xl border border-blue-100 rounded-2xl p-2 shadow-sm">

          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;

            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                  isActive
                    ? "text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-blue-50"
                }`}
              >

                {/* Active Background */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl" />
                )}

                {/* Shine Effect */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] animate-[shine_2s_linear_infinite]" />
                )}

                {/* Text */}
                <span className="relative z-10">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {tabs.map((tab) => {
          if (tab.name === activeTab) {
            return (
              <div
                key={tab.name}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                {tab.content}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default Tabs;