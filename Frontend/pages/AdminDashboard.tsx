
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { ColumnDirective, ColumnsDirective, GridComponent, Inject, Page, Sort, Filter as GridFilter } from '@syncfusion/ej2-react-grids';
import { gsap } from 'gsap';
import { animatePageIn, animateSectionsOnScroll, animateStagger, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { Download, Filter, Gavel, LayoutDashboard, Menu, Search, TrendingUp, Users, Wallet } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import campaignService from '../Services/campaigns';
import adminService from '../Services/admin';
import { getApiData } from '../store/apiHelpers';
import type { AdminOverview, Campaign } from '../types';

type CampaignRow = {
  id: string;
  title: string;
  organizer: string;
  goal: number;
  raised: number;
  status: 'pending' | 'active' | 'flagged' | 'completed';
  updatedAt: string;
};

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'moderation', label: 'Moderation', icon: Gavel, badge: 12 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'financials', label: 'Financials', icon: Wallet },
];

const mapStatus = (status: Campaign['status']): CampaignRow['status'] => {
  if (status === 'approved') return 'active';
  if (status === 'pending_verification') return 'pending';
  if (status === 'rejected') return 'flagged';
  return 'pending';
};

const statusStyles: Record<CampaignRow['status'], string> = {
  pending: 'bg-amber-50 text-amber-700',
  active: 'bg-emerald-50 text-emerald-700',
  flagged: 'bg-rose-50 text-rose-700',
  completed: 'bg-slate-100 text-slate-600',
};

const AdminDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('overview');
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRow | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CampaignRow['status']>('all');
  const [actionLoading, setActionLoading] = useState(false);

  const { data: overview } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: async () => {
      const response = await adminService.getOverview();
      return getApiData<AdminOverview>(response);
    }
  });

  const { data: moderationData } = useQuery({
    queryKey: ['admin', 'campaigns', statusFilter],
    queryFn: async () => {
      const statusMap: Record<CampaignRow['status'], Campaign['status']> = {
        pending: 'pending_verification',
        active: 'approved',
        flagged: 'rejected',
        completed: 'approved'
      };

      const response = await campaignService.getAll({
        status: statusFilter === 'all' ? undefined : statusMap[statusFilter],
        limit: 25,
        sort: 'desc'
      });
      return getApiData<{ data: Campaign[]; nextCursor: string | null }>(response);
    }
  });

  useEffect(() => {
    const mapped = (moderationData?.data ?? []).map((campaign) => ({
      id: campaign._id,
      title: campaign.title,
      organizer: campaign.organizer,
      goal: campaign.goalAmount,
      raised: campaign.raisedAmount,
      status: mapStatus(campaign.status),
      updatedAt: campaign.createdAt
    }));

    setCampaigns(mapped);
  }, [moderationData]);

  const handleVerify = async (status: 'approved' | 'rejected') => {
    if (!selectedCampaign) {
      return;
    }
    setActionLoading(true);
    try {
      await adminService.verifyCampaign(selectedCampaign.id, { status });
      setCampaigns((prev) =>
        prev.map((item) =>
          item.id === selectedCampaign.id
            ? { ...item, status: status === 'approved' ? 'active' : 'flagged' }
            : item
        )
      );
      setSelectedCampaign(null);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => setSidebarOpen(media.matches);
    handleChange();
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const totalFunds = useMemo(
    () => campaigns.reduce((sum, campaign) => sum + campaign.raised, 0),
    [campaigns]
  );
  const activeCampaigns = useMemo(
    () => campaigns.filter((campaign) => campaign.status === 'active').length,
    [campaigns]
  );
  const pendingCount = useMemo(
    () => campaigns.filter((campaign) => campaign.status === 'pending').length,
    [campaigns]
  );
  const totalDonors = overview?.donorsCount ?? 0;

  const filteredCampaigns = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return campaigns.filter((campaign) => {
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      const matchesSearch = term.length === 0
        || `${campaign.title} ${campaign.organizer}`.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [campaigns, searchTerm, statusFilter]);

  const donationOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      grid: { left: 10, right: 10, top: 20, bottom: 10, containLabel: true },
      xAxis: {
        type: 'category',
        data: ['Total'],
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisLabel: { color: '#6b7280' },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => `$${Math.round(value / 1000)}k`,
          color: '#6b7280',
        },
        splitLine: { lineStyle: { color: '#f3f4f6' } },
      },
      series: [
        {
          data: [overview?.totalDonated ?? 0],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#7f13ec', width: 3 },
          itemStyle: { color: '#7f13ec' },
          areaStyle: { color: 'rgba(127, 19, 236, 0.12)' },
        },
      ],
    }),
    []
  );

  const userGrowthOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      grid: { left: 10, right: 10, top: 20, bottom: 10, containLabel: true },
      xAxis: {
        type: 'category',
        data: ['Users'],
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisLabel: { color: '#6b7280' },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#6b7280' },
        splitLine: { lineStyle: { color: '#f3f4f6' } },
      },
      series: [
        {
          data: [overview?.usersCount ?? 0],
          type: 'bar',
          barWidth: 18,
          itemStyle: { color: '#7f13ec', borderRadius: [6, 6, 0, 0] },
        },
      ],
    }),
    []
  );

  useLayoutEffect(() => {
    ensureGsap();
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animatePageIn(containerRef.current as HTMLDivElement, 0.6);
      const sections = gsap.utils.toArray<HTMLElement>('[data-animate="section"]', containerRef.current);
      animateSectionsOnScroll(sections);

      const cards = gsap.utils.toArray<HTMLElement>('[data-animate="card"]', containerRef.current);
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
    <div ref={containerRef} className="admin-dashboard relative flex min-h-screen bg-gray-50 dark:bg-background-dark">
      <SidebarComponent
        id="admin-sidebar"
        width="260px"
        target=".admin-dashboard"
        type="Push"
        isOpen={sidebarOpen}
        closeOnDocumentClick
      >
        <aside className="h-full bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 flex flex-col">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <p className="text-lg font-bold text-gray-900 dark:text-white">ImpactGive Admin</p>
            <p className="text-xs text-gray-500">Operations console</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>
      </SidebarComponent>

      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col gap-6" data-animate="section">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="lg:hidden p-2 rounded-lg border border-gray-200 dark:border-gray-700"
                aria-label="Toggle navigation"
              >
                <Menu className="size-4" aria-hidden="true" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Health</h1>
                <p className="text-sm text-gray-500">Overview of activities and campaign status</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                <Download className="size-4" aria-hidden="true" /> Export CSV
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm" data-animate="card">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Funds</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                ${totalFunds.toLocaleString()}
              </h3>
              <div className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1">
                <TrendingUp className="size-3.5" aria-hidden="true" /> +14.2%
              </div>
            </div>
            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm" data-animate="card">
              <p className="text-sm font-medium text-gray-500 mb-1">Active Campaigns</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{activeCampaigns}</h3>
              <div className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1">
                <TrendingUp className="size-3.5" aria-hidden="true" /> +5.1%
              </div>
            </div>
            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-amber-200 dark:border-amber-900/30 shadow-sm" data-animate="card">
              <p className="text-sm font-medium text-gray-500 mb-1">Pending Verifications</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{pendingCount}</h3>
              <div className="text-amber-600 text-xs font-bold mt-2">Needs Action</div>
            </div>
            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm" data-animate="card">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Donors</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{totalDonors.toLocaleString()}</h3>
              <div className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1">
                <TrendingUp className="size-3.5" aria-hidden="true" /> +8.4%
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-animate="section">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm" data-animate="card">
            <h3 className="font-bold text-lg mb-6">Donation Volume</h3>
            <div className="h-64 w-full">
              <ReactECharts option={donationOption} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm" data-animate="card">
            <h3 className="font-bold text-lg mb-6">User Growth</h3>
            <div className="h-64 w-full">
              <ReactECharts option={userGrowthOption} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden" data-animate="section">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-bold text-lg">Campaign Verification Queue</h3>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" aria-hidden="true" />
                  <input
                    className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-transparent"
                    placeholder="Search campaigns"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="size-4 text-gray-400" aria-hidden="true" />
                  <select
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-transparent"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as CampaignRow['status'] | 'all')}
                  >
                    <option value="all">All status</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="flagged">Flagged</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {filteredCampaigns.length} campaigns matched
            </p>
          </div>
          <div className="p-4">
            <GridComponent
              dataSource={filteredCampaigns}
              allowPaging
              allowSorting
              allowFiltering
              pageSettings={{ pageSize: 6, pageSizes: [6, 10, 20] }}
              filterSettings={{ type: 'Menu' }}
              rowSelected={(args) => setSelectedCampaign(args.data as CampaignRow)}
            >
              <ColumnsDirective>
                <ColumnDirective field="title" headerText="Campaign" width="220" />
                <ColumnDirective field="organizer" headerText="Organizer" width="160" />
                <ColumnDirective
                  field="raised"
                  headerText="Raised"
                  textAlign="Right"
                  width="120"
                  template={(props: CampaignRow) => (
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${props.raised.toLocaleString()}
                    </span>
                  )}
                />
                <ColumnDirective
                  field="goal"
                  headerText="Goal"
                  textAlign="Right"
                  width="120"
                  template={(props: CampaignRow) => (
                    <span className="text-gray-500">
                      ${props.goal.toLocaleString()}
                    </span>
                  )}
                />
                <ColumnDirective
                  field="status"
                  headerText="Status"
                  width="140"
                  template={(props: CampaignRow) => (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold uppercase ${statusStyles[props.status]}`}>
                      {props.status}
                    </span>
                  )}
                />
                <ColumnDirective field="updatedAt" headerText="Last Update" width="140" />
                <ColumnDirective
                  headerText="Actions"
                  width="130"
                  textAlign="Center"
                  template={(props: CampaignRow) => (
                    <button
                      className="text-primary text-xs font-bold hover:underline"
                      onClick={() => setSelectedCampaign(props)}
                    >
                      {props.status === 'pending' ? 'Review' : 'Open'}
                    </button>
                  )}
                />
              </ColumnsDirective>
              <Inject services={[Page, Sort, GridFilter]} />
            </GridComponent>
          </div>
        </div>

        {selectedCampaign && (
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6" data-animate="section">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">Selected campaign</p>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCampaign.title}</h4>
                <p className="text-sm text-gray-500">Organizer: {selectedCampaign.organizer}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ButtonComponent
                  content="Approve"
                  cssClass="e-success"
                  disabled={actionLoading}
                  onClick={() => handleVerify('approved')}
                />
                <ButtonComponent
                  content="Flag"
                  cssClass="e-warning"
                  disabled={actionLoading}
                  onClick={() => handleVerify('rejected')}
                />
                <ButtonComponent
                  content="Close"
                  cssClass="e-outline"
                  onClick={() => setSelectedCampaign(null)}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
