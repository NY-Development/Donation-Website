import React from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../Services/admin';
import { getApiData } from '../../store/apiHelpers';
import type { AdminOverview as AdminOverviewStats } from '../../../types';
import { TrendingDown, TrendingUp } from 'lucide-react';

const AdminOverview: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: async () => {
      const response = await adminService.getOverview();
      return getApiData<AdminOverviewStats>(response);
    }
  });

  const totalDonated = data?.totalDonated ?? 0;
  const donorsCount = data?.donorsCount ?? 0;
  const campaignsApproved = data?.campaignsApproved ?? 0;
  const usersCount = data?.usersCount ?? 0;

  return (
    <div className="min-h-screen">
      <header className="h-20 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="relative w-96 hidden md:block">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/20 text-sm"
            placeholder="Search campaigns, donors, or ID..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-6">
          <button className="relative text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            <span className="material-icons">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
            <span className="material-icons text-sm">add</span>
            <span>New Campaign</span>
          </button>
        </div>
      </header>

      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400">Here is the latest performance snapshot.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg text-green-600">
                <span className="material-icons">account_balance_wallet</span>
              </div>
              <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <TrendingUp className="size-3" aria-hidden="true" /> 12.5%
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Funds Raised</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">${totalDonated.toLocaleString()}</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600">
                <span className="material-icons">rocket_launch</span>
              </div>
              <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                <TrendingUp className="size-3" aria-hidden="true" /> 4.2%
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Approved Campaigns</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{campaignsApproved}</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-icons">groups</span>
              </div>
              <span className="flex items-center text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                <TrendingUp className="size-3" aria-hidden="true" /> 8.1%
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Donors</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{donorsCount}</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg text-orange-600">
                <span className="material-icons">favorite</span>
              </div>
              <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                <TrendingDown className="size-3" aria-hidden="true" /> 0.5%
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Registered Users</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{usersCount}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Donation Trends</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-500 rounded hover:text-primary transition-colors">
                  W
                </button>
                <button className="px-3 py-1 text-xs font-bold bg-primary text-white rounded">M</button>
                <button className="px-3 py-1 text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-500 rounded hover:text-primary transition-colors">
                  Y
                </button>
              </div>
            </div>
            <div className="flex-1 relative min-h-65 flex flex-col justify-end">
              <div className="flex items-end justify-between gap-2 h-44">
                {[40, 60, 45, 75, 90, 65, 80].map((value, index) => (
                  <div key={index} className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[40%] relative group" style={{ height: `${value}%` }}>
                    <div className={`absolute inset-0 ${value > 80 ? 'bg-primary opacity-60' : 'bg-primary opacity-20'} rounded-t-sm`} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Top Campaigns</h3>
            <div className="space-y-6">
              {[
                { name: 'Education for All', progress: 75 },
                { name: 'Clean Water Initiative', progress: 42 },
                { name: 'Women in Tech Scholarships', progress: 58 }
              ].map((campaign) => (
                <div key={campaign.name} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-icons">campaign</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate">{campaign.name}</p>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${campaign.progress}%` }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{campaign.progress}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
