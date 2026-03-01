import React, { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import supportService from '../../Services/support';
import { getApiData, getErrorMessage } from '../../store/apiHelpers';
import { useTranslation } from 'react-i18next';
import { Search, RefreshCw, User, MessageSquare, Inbox, Send, Reply } from 'lucide-react';

type SupportItem = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: string;
  updatedAt: string;
  replies?: Array<{
    subject: string;
    content: string;
    sentAt: string;
    sentBy?: {
      id: string;
      name?: string;
      email?: string;
      role?: string;
    };
  }>;
  user?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };
};

type SupportListResponse = {
  data: SupportItem[];
  total: number;
  page: number;
  limit: number;
};

const AdminSupport: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [openReplyId, setOpenReplyId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState<{ subject: string; content: string }>({ subject: '', content: '' });
  const [replyFeedback, setReplyFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'support', search],
    queryFn: async () => {
      const response = await supportService.listForAdmin({
        limit: 100,
        search: search.trim() || undefined,
        status: 'open'
      });
      return getApiData<SupportListResponse>(response);
    }
  });

  const requests = data?.data ?? [];

  const sendReplyMutation = useMutation({
    mutationFn: async (payload: { id: string; subject: string; content: string }) => {
      await supportService.replyForAdmin(payload.id, {
        subject: payload.subject,
        content: payload.content
      });
    },
    onSuccess: () => {
      setReplyFeedback({
        type: 'success',
        text: t('pages.admin.support.replySuccess', 'Reply email sent successfully.')
      });
      setReplyDraft({ subject: '', content: '' });
      setOpenReplyId(null);
      void refetch();
    },
    onError: (error) => {
      setReplyFeedback({
        type: 'error',
        text: getErrorMessage(error)
      });
    }
  });

  const summary = useMemo(() => {
    return {
      total: data?.total ?? 0,
      open: requests.filter((item) => item.status === 'open').length,
      withAccount: requests.filter((item) => Boolean(item.user?.id)).length
    };
  }, [data?.total, requests]);

  const handleOpenReply = (item: SupportItem) => {
    setReplyFeedback(null);
    setOpenReplyId((prev) => {
      const willOpen = prev !== item.id;
      if (willOpen) {
        setReplyDraft({
          subject: `Re: ${item.subject}`,
          content: ''
        });
      }
      return willOpen ? item.id : null;
    });
  };

  const handleSendReply = (id: string) => {
    if (!replyDraft.subject.trim() || !replyDraft.content.trim()) {
      setReplyFeedback({
        type: 'error',
        text: t('pages.admin.support.replyValidation', 'Please provide both subject and message before sending.')
      });
      return;
    }

    sendReplyMutation.mutate({
      id,
      subject: replyDraft.subject.trim(),
      content: replyDraft.content.trim()
    });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('pages.admin.support.title', 'Support Requests')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
              {t('pages.admin.support.subtitle', 'Review contact issues submitted by users.')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/20 text-sm"
          >
            <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
            {t('pages.admin.support.refresh', 'Refresh')}
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <StatCard 
            label={t('pages.admin.support.stats.total', 'Total requests')} 
            value={summary.total} 
            icon={<Inbox className="size-5" />}
          />
          <StatCard 
            label={t('pages.admin.support.stats.open', 'Open requests')} 
            value={summary.open} 
            icon={<MessageSquare className="size-5" />}
          />
          <StatCard 
            label={t('pages.admin.support.stats.withAccount', 'From signed-in users')} 
            value={summary.withAccount} 
            icon={<User className="size-5" />}
          />
        </div>

        {/* List Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Search and Metadata Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                placeholder={t('pages.admin.support.searchPlaceholder', 'Search by name, email, subject...')}
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full self-start md:self-center">
              {t('pages.admin.support.showing', { shown: requests.length, total: summary.total, defaultValue: 'Showing {{shown}} of {{total}}' })}
            </span>
          </div>

          {/* Status Handling */}
          {isLoading && (
            <div className="p-12 text-center">
              <RefreshCw className="size-8 text-primary animate-spin mx-auto mb-4 opacity-20" />
              <p className="text-sm text-slate-500">{t('pages.admin.support.loading', 'Loading support requests...')}</p>
            </div>
          )}

          {isError && (
            <div className="p-12 text-center">
              <p className="text-sm text-red-600 font-medium">{t('pages.admin.support.error', 'Unable to load support requests right now.')}</p>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {replyFeedback && (
                <div className={`p-4 text-sm ${replyFeedback.type === 'error' ? 'text-red-600 bg-red-50 dark:bg-red-950/20' : 'text-green-700 bg-green-50 dark:bg-green-950/20'}`}>
                  {replyFeedback.text}
                </div>
              )}
              {requests.map((item) => (
                <article key={item.id} className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-primary transition-colors">
                        {item.subject}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <span className="truncate">{item.email}</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                        <span className="uppercase font-bold tracking-wider">{t('pages.admin.support.submitted_label', 'Submitted')}:</span>
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                      
                      {item.user?.id && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 text-primary rounded text-[10px] font-bold mt-2 border border-primary/10 uppercase">
                          <User className="size-3" />
                          {t('pages.admin.support.accountLinked', {
                            role: item.user.role ?? 'user',
                            defaultValue: 'Linked: {{role}}'
                          })}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 self-start">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {item.message}
                    </p>
                  </div>

                  {(item.replies?.length ?? 0) > 0 && (
                    <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        {t('pages.admin.support.replyHistory', 'Reply History')}
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-900">
                        {(item.replies ?? []).map((reply, index) => (
                          <div key={`${item.id}-reply-${index}`} className="p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                              <span className="font-semibold text-slate-700 dark:text-slate-200">{reply.subject}</span>
                              <span>
                                {t('pages.admin.support.repliedAt', {
                                  date: new Date(reply.sentAt).toLocaleString(),
                                  defaultValue: 'Replied {{date}}'
                                })}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{reply.content}</p>
                            {reply.sentBy?.name && (
                              <p className="mt-2 text-xs text-primary">
                                {t('pages.admin.support.repliedBy', {
                                  name: reply.sentBy.name,
                                  defaultValue: 'Sent by {{name}}'
                                })}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenReply(item)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Reply className="size-4" aria-hidden="true" />
                      {t('pages.admin.support.reply', 'Reply')}
                    </button>
                  </div>

                  {openReplyId === item.id && (
                    <div className="mt-4 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-primary/20">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                            {t('pages.admin.support.replySubject', 'Reply Subject')}
                          </label>
                          <input
                            type="text"
                            value={replyDraft.subject}
                            onChange={(event) => setReplyDraft((prev) => ({ ...prev, subject: event.target.value }))}
                            placeholder={t('pages.admin.support.replySubjectPlaceholder', 'Enter email subject')}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                            {t('pages.admin.support.replyContent', 'Reply Message')}
                          </label>
                          <textarea
                            rows={5}
                            value={replyDraft.content}
                            onChange={(event) => setReplyDraft((prev) => ({ ...prev, content: event.target.value }))}
                            placeholder={t('pages.admin.support.replyContentPlaceholder', 'Type your response email content...')}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm resize-y"
                          />
                        </div>

                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setOpenReplyId(null)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-700"
                          >
                            {t('common.cancel', 'Cancel')}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendReply(item.id)}
                            disabled={sendReplyMutation.isPending}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                          >
                            <Send className="size-4" aria-hidden="true" />
                            {sendReplyMutation.isPending
                              ? t('pages.admin.support.sendingReply', 'Sending...')
                              : t('pages.admin.support.sendReply', 'Send Reply')}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              ))}

              {requests.length === 0 && (
                <div className="p-12 text-center">
                  <Inbox className="size-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                  <p className="text-sm text-slate-500">{t('pages.admin.support.empty', 'No support requests found.')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Internal Stat Card Helper
const StatCard = ({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
    <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary group-hover:bg-primary/5 rounded-xl transition-all">
      {icon}
    </div>
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black mt-0.5 tabular-nums">{value}</p>
    </div>
  </div>
);

export default AdminSupport;