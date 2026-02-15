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
      <div className="p-8">
        <p className="text-sm text-slate-500">{t('pages.admin.settings.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <span className="material-icons-round text-primary">settings</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">{t('pages.admin.settings.title')}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{t('pages.admin.settings.breadcrumb.admin')}</span>
                <span className="material-icons-round text-[10px]">chevron_right</span>
                <span className="text-primary font-medium">{t('pages.admin.settings.breadcrumb.settings')}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 pb-32">
        <div className="flex flex-col gap-8">
          <section className="scroll-mt-24" id="general">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons-round text-primary/60">public</span>
              <h2 className="text-xl font-bold">{t('pages.admin.settings.sections.general')}</h2>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5 p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pages.admin.settings.labels.platformName')}</label>
                  <input
                    className="w-full bg-slate-50 dark:bg-slate-800 border-primary/10 rounded-lg focus:ring-primary focus:border-primary transition-all"
                    type="text"
                    value={formState.platformName}
                    onChange={(event) => update('platformName', event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pages.admin.settings.labels.supportEmail')}</label>
                  <input
                    className="w-full bg-slate-50 dark:bg-slate-800 border-primary/10 rounded-lg focus:ring-primary focus:border-primary transition-all"
                    type="email"
                    value={formState.supportEmail}
                    onChange={(event) => update('supportEmail', event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pages.admin.settings.labels.fontFamily')}</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-800 border-primary/10 rounded-lg focus:ring-primary focus:border-primary transition-all"
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
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div>
                  <p className="font-semibold">{t('pages.admin.settings.labels.maintenanceMode')}</p>
                  <p className="text-xs text-slate-500">{t('pages.admin.settings.help.maintenanceMode')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
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

          <section className="scroll-mt-24" id="payments">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons-round text-primary/60">payments</span>
              <h2 className="text-xl font-bold">{t('pages.admin.settings.sections.payments')}</h2>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5 p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pages.admin.settings.labels.platformFee')}</label>
                  <div className="relative">
                    <input
                      className="w-full bg-slate-50 dark:bg-slate-800 border-primary/10 rounded-lg focus:ring-primary focus:border-primary transition-all pr-8"
                      type="number"
                      value={formState.platformFeePercent}
                      onChange={(event) => update('platformFeePercent', Number(event.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('pages.admin.settings.labels.currency')}</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-800 border-primary/10 rounded-lg focus:ring-primary focus:border-primary transition-all"
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

          <section className="scroll-mt-24" id="security">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons-round text-primary/60">security</span>
              <h2 className="text-xl font-bold">{t('pages.admin.settings.sections.security')}</h2>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5 p-6">
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{t('pages.admin.settings.labels.enforce2fa')}</p>
                    <p className="text-sm text-slate-500">{t('pages.admin.settings.help.enforce2fa')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      className="sr-only peer"
                      type="checkbox"
                      checked={formState.enforce2fa}
                      onChange={(event) => update('enforce2fa', event.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{t('pages.admin.settings.labels.sessionTimeout')}</p>
                    <p className="text-sm text-slate-500">{t('pages.admin.settings.help.sessionTimeout')}</p>
                  </div>
                  <select
                    className="bg-slate-50 dark:bg-slate-800 border-primary/10 rounded-lg text-sm font-medium"
                    value={formState.sessionTimeoutMinutes}
                    onChange={(event) => update('sessionTimeoutMinutes', Number(event.target.value))}
                  >
                    <option value={15}>{t('pages.admin.settings.options.minutes', { minutes: 15 })}</option>
                    <option value={30}>{t('pages.admin.settings.options.minutes', { minutes: 30 })}</option>
                    <option value={60}>{t('pages.admin.settings.options.hour', { hours: 1 })}</option>
                    <option value={240}>{t('pages.admin.settings.options.hours', { hours: 4 })}</option>
                  </select>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{t('pages.admin.settings.labels.auditLogging')}</p>
                    <p className="text-sm text-slate-500">{t('pages.admin.settings.help.auditLogging')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
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

          <section className="scroll-mt-24" id="notifications">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons-round text-primary/60">notifications_active</span>
              <h2 className="text-xl font-bold">{t('pages.admin.settings.sections.notifications')}</h2>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5 p-6 space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('pages.admin.settings.labels.emailAlerts')}</label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors group cursor-pointer border border-transparent hover:border-primary/10">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-icons-round">volunteer_activism</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t('pages.admin.settings.notifications.largeDonation.title')}</p>
                      <p className="text-xs text-slate-500">{t('pages.admin.settings.notifications.largeDonation.body')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
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
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors group cursor-pointer border border-transparent hover:border-primary/10">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-icons-round">campaign</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{t('pages.admin.settings.notifications.newCampaign.title')}</p>
                      <p className="text-xs text-slate-500">{t('pages.admin.settings.notifications.newCampaign.body')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
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
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="fixed bottom-0 inset-x-0 bg-white/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-primary/10 py-4 px-6 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
            <span className="material-icons-round text-amber-500 text-sm">info</span>
            <span>{t('pages.admin.settings.saveReminder')}</span>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-primary/20 rounded-lg transition-colors">
              {t('pages.admin.settings.discard')}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 md:flex-none px-8 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              disabled={saving}
            >
              {saving ? t('pages.admin.settings.saving') : t('pages.admin.settings.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
