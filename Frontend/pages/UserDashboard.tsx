
import React from 'react';

const UserDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Welcome back, Alex!</h1>
          <p className="text-gray-500">You're making a real difference. Here's your impact overview.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary px-6 py-2.5 rounded-lg text-white font-bold hover:shadow-lg transition-all">
          <span className="material-symbols-outlined">volunteer_activism</span>
          Donate Again
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-2">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Donated</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">$2,450</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-2">
          <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
            <span className="material-symbols-outlined">favorite</span>
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Lives Touched</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">342</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-2">
          <div className="size-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2">
            <span className="material-symbols-outlined">campaign</span>
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Projects Supported</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">18</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">timeline</span>
              Timeline of Impact
            </h3>
            <div className="space-y-12">
              <div className="relative pl-8 border-l-2 border-primary/20">
                <div className="absolute top-0 -left-[9px] size-4 rounded-full bg-primary ring-4 ring-primary/10"></div>
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-sm font-bold text-primary">Clean Water Initiative</span>
                    <span className="text-sm text-gray-400 mx-2">•</span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <h4 className="text-lg font-bold">Construction complete on the village well!</h4>
                  <p className="text-gray-600 dark:text-gray-400">We are thrilled to announce that the new solar-powered well in Kajiado is fully operational. Over 200 families now have access to clean, safe water.</p>
                  <div className="w-full aspect-video rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                     <span className="material-symbols-outlined text-gray-400 text-5xl">image</span>
                  </div>
                </div>
              </div>
              <div className="relative pl-8 border-l-2 border-primary/20">
                <div className="absolute top-0 -left-[9px] size-4 rounded-full bg-green-500 ring-4 ring-green-500/10"></div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">You made a donation</span>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl flex items-center justify-between border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                      <span className="font-bold">Emergency Medical Relief</span>
                    </div>
                    <span className="font-bold">$50.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">sync</span>
              Active Subscriptions
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <span className="material-symbols-outlined">school</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Education Fund</p>
                    <p className="text-xs text-gray-500">Monthly • Next: Oct 15</p>
                  </div>
                </div>
                <span className="font-bold text-sm">$25</span>
              </div>
            </div>
            <button className="w-full mt-6 text-sm font-bold text-primary hover:underline">Manage Subscriptions</button>
          </div>

          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-warning">workspace_premium</span>
              Badges Earned
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="aspect-square rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600" title="First Donation">
                <span className="material-symbols-outlined">star</span>
              </div>
              <div className="aspect-square rounded-full bg-purple-100 flex items-center justify-center text-purple-600" title="Monthly Supporter">
                <span className="material-symbols-outlined">event_repeat</span>
              </div>
              <div className="aspect-square rounded-full bg-pink-100 flex items-center justify-center text-pink-600" title="Life Changer">
                <span className="material-symbols-outlined">favorite</span>
              </div>
              <div className="aspect-square rounded-full bg-blue-100 flex items-center justify-center text-blue-600" title="Eco Hero">
                <span className="material-symbols-outlined">forest</span>
              </div>
            </div>
            <button className="w-full mt-6 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
              + View All Badges
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
