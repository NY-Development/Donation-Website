import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../Services/admin';
import { getApiData } from '../../store/apiHelpers';
import type { AdminOverview as AdminOverviewStats, AdminTopCampaign, DonationTrendPoint } from '../../../types';
import { TrendingDown, TrendingUp, Search, Bell, Plus, Users, Wallet, Rocket, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactECharts from 'echarts-for-react';

const AdminOverview: React.FC = () => {
  const { t } = useTranslation();

  // Fetch Core Stats
  const { data: stats } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: async () => {
      const response = await adminService.getOverview();
      return getApiData<AdminOverviewStats>(response);
    }
  });

  // Fetch Trend Data
  const { data: trends } = useQuery({
    queryKey: ['admin', 'trends'],
    queryFn: async () => {
      const response = await adminService.getTrends({ days: 30 }); // Increased range for better chart
      return getApiData<DonationTrendPoint[]>(response) ?? [];
    }
  });

  // Fetch Top Campaigns
  const { data: topCampaigns } = useQuery({
    queryKey: ['admin', 'top-campaigns'],
    queryFn: async () => {
      const response = await adminService.getTopCampaigns({ limit: 5 });
      return getApiData<AdminTopCampaign[]>(response) ?? [];
    }
  });

  // Chart Configuration: Donation Trends (Area Chart)
  const trendChartOption = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderWidth: 0,
      textStyle: { color: '#1e293b' },
      formatter: (params: any) => `
        <div style="padding: 4px">
          <div style="font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase">${params[0].name}</div>
          <div style="font-size: 14px; font-weight: 800; color: #0284c7">ETB ${params[0].value.toLocaleString()}</div>
        </div>
      `
    },
    grid: { left: '2%', right: '2%', bottom: '0%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: trends?.map(p => new Date(p.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })) ?? [],
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#e2e8f0' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    series: [{
      data: trends?.map(p => p.total) ?? [],
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: { color: '#0284c7' },
      lineStyle: { width: 3, color: '#0284c7' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(2, 132, 199, 0.2)' },
            { offset: 1, color: 'rgba(2, 132, 199, 0)' }
          ]
        }
      }
    }]
  }), [trends]);

  // Chart Configuration: Campaign Performance (Pie/Donut)
  const campaignDonutOption = useMemo(() => ({
    tooltip: { trigger: 'item' },
    legend: { bottom: '0%', left: 'center', icon: 'circle', textStyle: { color: '#94a3b8', fontSize: 11 } },
    series: [{
      name: 'Funds Raised',
      type: 'pie',
      radius: ['50%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: topCampaigns?.map(c => ({ value: c.raisedAmount, name: c.title })) ?? []
    }]
  }), [topCampaigns]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background-dark">
      {/* Sticky Header */}
      <header className="h-16 sm:h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-center sticky top-0 z-30">
        <div className="relative w-full max-w-96 hidden md:block">
          <Search className="absolute left-3 top-2 text-slate-400 size-4" />
          <input
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20"
            placeholder={t('pages.admin.overview.searchPlaceholder')}
            type="text"
          />
        </div>
        {/* <div className="flex items-center gap-3 sm:gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-all">
            <Bell className="size-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all text-sm active:scale-95">
            <Plus className="size-4" />
            <span className="hidden sm:inline">{t('pages.admin.overview.newCampaign')}</span>
          </button>
        </div> */}
      </header>

      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Welcome Section */}
        <section>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('pages.admin.overview.welcome')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t('pages.admin.overview.subtitle')}</p>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard 
            title={t('pages.admin.overview.cards.totalFunds')} 
            value={`ETB ${(stats?.totalDonated ?? 0).toLocaleString()}`}
            trend="+12.5%" 
            icon={<Wallet />} 
            color="green" 
          />
          <StatCard 
            title={t('pages.admin.overview.cards.approvedCampaigns')} 
            value={stats?.campaignsApproved ?? 0}
            trend="+4.2%" 
            icon={<Rocket />} 
            color="blue" 
          />
          <StatCard 
            title={t('pages.admin.overview.cards.totalDonors')} 
            value={stats?.donorsCount ?? 0}
            trend="+8.1%" 
            icon={<Users />} 
            color="primary" 
          />
          <StatCard 
            title={t('pages.admin.overview.cards.registeredUsers')} 
            value={stats?.usersCount ?? 0}
            trend="-0.5%" 
            icon={<Heart />} 
            color="orange" 
            isDown
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Trend Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white">{t('pages.admin.overview.trends.title')}</h3>
              <select className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 focus:ring-0">
                <option>{t('pages.admin.overview.trends.month')}</option>
                <option>{t('pages.admin.overview.trends.week')}</option>
              </select>
            </div>
            <ReactECharts option={trendChartOption} style={{ height: '320px' }} />
          </div>

          {/* Campaign Distribution Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Funding Distribution</h3>
            <ReactECharts option={campaignDonutOption} style={{ height: '320px' }} />
          </div>
        </div>

        {/* Top Campaigns List */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">{t('pages.admin.overview.topCampaigns')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCampaigns?.map((campaign) => {
              const progress = campaign.goalAmount ? Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)) : 0;
              return (
                <div key={campaign.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate flex-1 pr-2">{campaign.title}</p>
                    <span className="text-[10px] font-black px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-1000" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                  <div className="flex justify-between mt-3 text-[11px] font-medium text-slate-500">
                    <span>ETB {campaign.raisedAmount.toLocaleString()}</span>
                    <span>Goal: ETB {campaign.goalAmount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for clean Stat Cards
const StatCard = ({ title, value, trend, icon, color, isDown = false }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-primary/30 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl transition-colors ${
        color === 'green' ? 'bg-green-50 text-green-600' : 
        color === 'blue' ? 'bg-blue-50 text-blue-600' : 
        color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-primary/10 text-primary'
      }`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className={`flex items-center text-[11px] font-black px-2 py-1 rounded-full ${isDown ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
        {isDown ? <TrendingDown className="size-3 mr-1" /> : <TrendingUp className="size-3 mr-1" />}
        {trend}
      </span>
    </div>
    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
    <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white tabular-nums">{value}</h3>
  </div>
);

export default AdminOverview;