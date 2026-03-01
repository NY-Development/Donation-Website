import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../Services/admin';
import { getApiData } from '../../store/apiHelpers';
import { useTranslation } from 'react-i18next';

type SettingsPayload = {
  platformName: string;
  supportEmail: string;
  fontFamily: 'Source Sans Pro' | 'Roboto' | 'Proxima Nova' | 'Lato';
  maintenanceMode: boolean;
  platformFeePercent: number;
  settlementCurrency: string;
  enforce2fa: boolean;
  sessionTimeoutMinutes: number;
  auditLogging: boolean;
  notifications: {
    largeDonation: boolean;
    newCampaignVerification: boolean;
  };
};

const AdminSettings: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const response = await adminService.getSettings();
      return getApiData<SettingsPayload>(response);
    }
  });

  const [formState, setFormState] = useState<SettingsPayload | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setFormState(data);
    }
  }, [data]);

  useEffect(() => {
    if (!formState?.fontFamily) return;
    const fontMap: Record<SettingsPayload['fontFamily'], string> = {
      'Source Sans Pro': '"Source Sans Pro", sans-serif',
      Roboto: '"Roboto", sans-serif',
      'Proxima Nova': '"Proxima Nova", "Source Sans Pro", sans-serif',
      Lato: '"Lato", sans-serif'
    };
    document.documentElement.style.setProperty('--font-sans', fontMap[formState.fontFamily]);
  }, [formState?.fontFamily]);

  const update = <K extends keyof SettingsPayload>(key: K, value: SettingsPayload[K]) => {
    if (!formState) return;
    setFormState({ ...formState, [key]: value });
  };

  const handleSave = async () => {
    if (!formState) return;
    setSaving(true);
    try {
      await adminService.updateSettings(formState);
    } finally {
      setSaving(false);
    }
  };

  if (!formState) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">{t('pages.admin.settings.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100">
      <header className="bg-white dark:bg-background-dark border-b border-primary/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <span className="material-icons-round text-primary text-xl sm:text-2xl">settings</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold truncate">{t('pages.admin.settings.title')}</h1>
              <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-slate-500">
                <span className="truncate">{t('pages.admin.settings.breadcrumb.admin')}</span>
                <span className="material-icons-round text-[10px] shrink-0">chevron_right</span>
                <span className="text-primary font-medium truncate">{t('pages.admin.settings.breadcrumb.settings')}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col gap-6 sm:gap-10">
          
          {/* General Section */}
          <section id="general">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons-round text-primary/60">public</span>
              <h2 className="text-lg sm:text-xl font-bold">{t('pages.admin.settings.sections.general')}</h2>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5 p-4 sm:p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pages.admin.settings.labels.platformName')}</label>
                  <input
                    className="w-full bg-slate-50 dark:bg-slate-800 border-primary/10 rounded-lg focus:ring-primary focus:border-primary transition-all text-sm py-2.5"
                    type="text"
                    value={formState.platformName}
                    onChange={(event) => update('platformName', event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pages.admin.settings.labels.supportEmail')}</label>
                  <input
                    className="w-full bg-slate-50 dark:bg-slate-800 border-primary/10 rounded-lg focus:ring-primary focus:border-primary transition-all text-sm py-2.5"
                    type="email"
                    value={formState.supportEmail}
                    onChange={(event) => update('supportEmail', event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pages.admin.settings.labels.fontFamily')}</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-800 border-primary/10 rounded-lg focus:ring-primary focus:border-primary transition-all text-sm py-2.5"
                    value={formState.fontFamily}
                    onChange={(event) => update('fontFamily', event.target.value as SettingsPayload['fontFamily'])}
                  >
                    <option value="Source Sans Pro">Source Sans Pro</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Proxima Nova">Proxima Nova</option>
                    <option value="Lato">Lato</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div>
                  <p className="font-semibold text-sm sm:text-base">{t('pages.admin.settings.labels.maintenanceMode')}</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 max-w-md">{t('pages.admin.settings.help.maintenanceMode')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    className="sr-only peer"
                    type="checkbox"
                    checked={formState.maintenanceMode}
                    onChange={(event) => update('maintenanceMode', event.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Payments Section */}
          <section id="payments">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons-round text-primary/60">payments</span>
              <h2 className="text-lg sm:text-xl font-bold">{t('pages.admin.settings.sections.payments')}</h2>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5 p-4 sm:p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pages.admin.settings.labels.platformFee')}</label>
                  <div className="relative">
                    <input
                      className="w-full bg-slate-50 dark:bg-slate-800 border-primary/10 rounded-lg focus:ring-primary focus:border-primary transition-all pr-8 text-sm py-2.5"
                      type="number"
                      value={formState.platformFeePercent}
                      onChange={(event) => update('platformFeePercent', Number(event.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pages.admin.settings.labels.currency')}</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-800 border-primary/10 rounded-lg focus:ring-primary focus:border-primary transition-all text-sm py-2.5"
                    value={formState.settlementCurrency}
                    onChange={(event) => update('settlementCurrency', event.target.value)}
                  >
                    <option>ETB</option>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section id="security">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons-round text-primary/60">security</span>
              <h2 className="text-lg sm:text-xl font-bold">{t('pages.admin.settings.sections.security')}</h2>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5 p-4 sm:p-6">
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm sm:text-base">{t('pages.admin.settings.labels.enforce2fa')}</p>
                    <p className="text-[11px] sm:text-xs text-slate-500">{t('pages.admin.settings.help.enforce2fa')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      className="sr-only peer"
                      type="checkbox"
                      checked={formState.enforce2fa}
                      onChange={(event) => update('enforce2fa', event.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm sm:text-base">{t('pages.admin.settings.labels.sessionTimeout')}</p>
                    <p className="text-[11px] sm:text-xs text-slate-500">{t('pages.admin.settings.help.sessionTimeout')}</p>
                  </div>
                  <select
                    className="bg-slate-50 dark:bg-slate-800 border-primary/10 rounded-lg text-sm font-bold py-2 px-3 sm:w-auto"
                    value={formState.sessionTimeoutMinutes}
                    onChange={(event) => update('sessionTimeoutMinutes', Number(event.target.value))}
                  >
                    <option value={15}>{t('pages.admin.settings.options.minutes', { minutes: 15 })}</option>
                    <option value={30}>{t('pages.admin.settings.options.minutes', { minutes: 30 })}</option>
                    <option value={60}>{t('pages.admin.settings.options.hour', { hours: 1 })}</option>
                    <option value={240}>{t('pages.admin.settings.options.hours', { hours: 4 })}</option>
                  </select>
                </div>
                <div className="flex items-start justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm sm:text-base">{t('pages.admin.settings.labels.auditLogging')}</p>
                    <p className="text-[11px] sm:text-xs text-slate-500">{t('pages.admin.settings.help.auditLogging')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      className="sr-only peer"
                      type="checkbox"
                      checked={formState.auditLogging}
                      onChange={(event) => update('auditLogging', event.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section id="notifications">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons-round text-primary/60">notifications_active</span>
              <h2 className="text-lg sm:text-xl font-bold">{t('pages.admin.settings.sections.notifications')}</h2>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5 p-4 sm:p-6 space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{t('pages.admin.settings.labels.emailAlerts')}</label>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors group border border-transparent hover:border-primary/10">
                    <div className="w-10 h-10 rounded-full bg-primary/10 shrink-0 flex items-center justify-center text-primary">
                      <span className="material-icons-round text-xl">volunteer_activism</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base">{t('pages.admin.settings.notifications.largeDonation.title')}</p>
                      <p className="text-[11px] sm:text-xs text-slate-500 truncate">{t('pages.admin.settings.notifications.largeDonation.body')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        className="sr-only peer"
                        type="checkbox"
                        checked={formState.notifications.largeDonation}
                        onChange={(event) =>
                          update('notifications', {
                            ...formState.notifications,
                            largeDonation: event.target.checked
                          })
                        }
                      />
                      <div className="w-10 h-5 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors group border border-transparent hover:border-primary/10">
                    <div className="w-10 h-10 rounded-full bg-primary/10 shrink-0 flex items-center justify-center text-primary">
                      <span className="material-icons-round text-xl">campaign</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base">{t('pages.admin.settings.notifications.newCampaign.title')}</p>
                      <p className="text-[11px] sm:text-xs text-slate-500 truncate">{t('pages.admin.settings.notifications.newCampaign.body')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        className="sr-only peer"
                        type="checkbox"
                        checked={formState.notifications.newCampaignVerification}
                        onChange={(event) =>
                          update('notifications', {
                            ...formState.notifications,
                            newCampaignVerification: event.target.checked
                          })
                        }
                      />
                      <div className="w-10 h-5 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Inline Action Bar - Now exactly below notifications */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 p-4 sm:p-6 mt-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="material-icons-round text-amber-500 text-sm">info</span>
                <span>{t('pages.admin.settings.saveReminder')}</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <button 
                  type="button"
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95 border border-slate-200 dark:border-slate-700"
                >
                  {t('pages.admin.settings.discard')}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 sm:flex-none px-6 sm:px-10 py-2.5 bg-primary text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  disabled={saving}
                >
                  {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {saving ? t('pages.admin.settings.saving') : t('pages.admin.settings.save')}
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminSettings;