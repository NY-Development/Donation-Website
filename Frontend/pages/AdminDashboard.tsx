
import React, { useLayoutEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { gsap } from 'gsap';
import { animatePageIn, animateSectionsOnScroll, animateStagger, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';

const AdminDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const donationData = [
    { name: 'Week 1', value: 25000 },
    { name: 'Week 2', value: 42000 },
    { name: 'Week 3', value: 65000 },
    { name: 'Week 4', value: 89000 },
  ];

  const userGrowthData = [
    { name: 'Mon', value: 120 },
    { name: 'Tue', value: 155 },
    { name: 'Wed', value: 130 },
    { name: 'Thu', value: 210 },
    { name: 'Fri', value: 180 },
    { name: 'Sat', value: 245 },
    { name: 'Sun', value: 290 },
  ];

  useLayoutEffect(() => {
    ensureGsap();
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animatePageIn(containerRef.current as HTMLDivElement, 0.6);
      const sections = gsap.utils.toArray<HTMLElement>('[data-animate="section"]', containerRef.current);
      animateSectionsOnScroll(sections);

      const cards = gsap.utils.toArray('[data-animate="card"]', containerRef.current);
      animateStagger(cards, {
        y: 14,
        duration: 0.55,
        stagger: 0.06,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0">
        <nav className="flex-1 p-4 space-y-1">
          <a className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary rounded-lg font-medium" href="#">
            <span className="material-symbols-outlined text-[20px]">dashboard</span> Overview
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg font-medium" href="#">
            <span className="material-symbols-outlined text-[20px]">gavel</span> Moderation
            <span className="ml-auto bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full">12</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg font-medium" href="#">
            <span className="material-symbols-outlined text-[20px]">group</span> Users
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg font-medium" href="#">
            <span className="material-symbols-outlined text-[20px]">payments</span> Financials
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
        <div className="flex justify-between items-center" data-animate="section">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Health</h1>
            <p className="text-sm text-gray-500">Overview of activities and campaign status</p>
          </div>
          <button className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
            <span className="material-symbols-outlined text-[18px]">download</span> Export
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-animate="section">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm" data-animate="card">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Funds</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">$12.4M</h3>
            <div className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span> +14.2%
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm" data-animate="card">
            <p className="text-sm font-medium text-gray-500 mb-1">Active Campaigns</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">1,894</h3>
            <div className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span> +5.1%
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-amber-200 dark:border-amber-900/30 shadow-sm" data-animate="card">
            <p className="text-sm font-medium text-gray-500 mb-1">Pending Verifications</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">45</h3>
            <div className="text-amber-600 text-xs font-bold mt-2">Needs Action</div>
          </div>
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm" data-animate="card">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Donors</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">89,432</h3>
            <div className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span> +8.4%
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-animate="section">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm" data-animate="card">
            <h3 className="font-bold text-lg mb-6">Donation Volume</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={donationData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7f13ec" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#7f13ec" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#7f13ec" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm" data-animate="card">
            <h3 className="font-bold text-lg mb-6">User Growth</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7f13ec" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Table Mockup */}
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden" data-animate="section">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h3 className="font-bold text-lg">Pending Verifications</h3>
            <button className="text-sm font-bold text-primary">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 text-xs uppercase font-bold text-gray-500">
                <tr>
                  <th className="px-6 py-4">Campaign</th>
                  <th className="px-6 py-4">Creator</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <tr className="text-sm">
                  <td className="px-6 py-4 font-medium">Clean Water for Village A</td>
                  <td className="px-6 py-4 text-gray-500">John Doe</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold uppercase">Pending Review</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary font-bold text-xs hover:underline">Review</button>
                  </td>
                </tr>
                <tr className="text-sm">
                  <td className="px-6 py-4 font-medium">Education for All</td>
                  <td className="px-6 py-4 text-gray-500">Sarah Smith</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold uppercase">Pending Review</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary font-bold text-xs hover:underline">Review</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
