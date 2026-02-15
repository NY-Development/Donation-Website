export type HelpArticle = {
  id: string;
  titleKey: string;
  summaryKey: string;
  contentKeys: string[];
  tagKeys: string[];
  categoryKey: string;
};

export const helpTopics = ['donations', 'receipts', 'verification', 'campaignTips', 'security', 'account'] as const;

export const helpArticles: HelpArticle[] = [
  {
    id: 'donate-guest',
    titleKey: 'pages.helpCenter.articles.donateGuest.title',
    summaryKey: 'pages.helpCenter.articles.donateGuest.summary',
    contentKeys: [
      'pages.helpCenter.articles.donateGuest.content.0',
      'pages.helpCenter.articles.donateGuest.content.1',
      'pages.helpCenter.articles.donateGuest.content.2',
      'pages.helpCenter.articles.donateGuest.content.3'
    ],
    tagKeys: [
      'pages.helpCenter.tags.donations',
      'pages.helpCenter.tags.guest',
      'pages.helpCenter.tags.receipts',
      'pages.helpCenter.tags.dashboard'
    ],
    categoryKey: 'pages.helpCenter.categories.donations'
  },
  {
    id: 'donation-receipts',
    titleKey: 'pages.helpCenter.articles.donationReceipts.title',
    summaryKey: 'pages.helpCenter.articles.donationReceipts.summary',
    contentKeys: [
      'pages.helpCenter.articles.donationReceipts.content.0',
      'pages.helpCenter.articles.donationReceipts.content.1',
      'pages.helpCenter.articles.donationReceipts.content.2'
    ],
    tagKeys: [
      'pages.helpCenter.tags.donations',
      'pages.helpCenter.tags.receipts',
      'pages.helpCenter.tags.dashboard'
    ],
    categoryKey: 'pages.helpCenter.categories.donations'
  },
  {
    id: 'organizer-verification',
    titleKey: 'pages.helpCenter.articles.organizerVerification.title',
    summaryKey: 'pages.helpCenter.articles.organizerVerification.summary',
    contentKeys: [
      'pages.helpCenter.articles.organizerVerification.content.0',
      'pages.helpCenter.articles.organizerVerification.content.1',
      'pages.helpCenter.articles.organizerVerification.content.2'
    ],
    tagKeys: [
      'pages.helpCenter.tags.verification',
      'pages.helpCenter.tags.organizer',
      'pages.helpCenter.tags.nationalId'
    ],
    categoryKey: 'pages.helpCenter.categories.verification'
  },
  {
    id: 'campaign-draft',
    titleKey: 'pages.helpCenter.articles.campaignDraft.title',
    summaryKey: 'pages.helpCenter.articles.campaignDraft.summary',
    contentKeys: [
      'pages.helpCenter.articles.campaignDraft.content.0',
      'pages.helpCenter.articles.campaignDraft.content.1',
      'pages.helpCenter.articles.campaignDraft.content.2',
      'pages.helpCenter.articles.campaignDraft.content.3'
    ],
    tagKeys: [
      'pages.helpCenter.tags.campaigns',
      'pages.helpCenter.tags.draft',
      'pages.helpCenter.tags.deadline'
    ],
    categoryKey: 'pages.helpCenter.categories.campaigns'
  },
  {
    id: 'campaign-updates',
    titleKey: 'pages.helpCenter.articles.campaignUpdates.title',
    summaryKey: 'pages.helpCenter.articles.campaignUpdates.summary',
    contentKeys: [
      'pages.helpCenter.articles.campaignUpdates.content.0',
      'pages.helpCenter.articles.campaignUpdates.content.1',
      'pages.helpCenter.articles.campaignUpdates.content.2'
    ],
    tagKeys: [
      'pages.helpCenter.tags.campaigns',
      'pages.helpCenter.tags.updates',
      'pages.helpCenter.tags.dashboard'
    ],
    categoryKey: 'pages.helpCenter.categories.campaigns'
  },
  {
    id: 'campaign-closure',
    titleKey: 'pages.helpCenter.articles.campaignClosure.title',
    summaryKey: 'pages.helpCenter.articles.campaignClosure.summary',
    contentKeys: [
      'pages.helpCenter.articles.campaignClosure.content.0',
      'pages.helpCenter.articles.campaignClosure.content.1',
      'pages.helpCenter.articles.campaignClosure.content.2'
    ],
    tagKeys: [
      'pages.helpCenter.tags.campaigns',
      'pages.helpCenter.tags.deadline',
      'pages.helpCenter.tags.goalReached'
    ],
    categoryKey: 'pages.helpCenter.categories.campaigns'
  },
  {
    id: 'security-basics',
    titleKey: 'pages.helpCenter.articles.securityBasics.title',
    summaryKey: 'pages.helpCenter.articles.securityBasics.summary',
    contentKeys: [
      'pages.helpCenter.articles.securityBasics.content.0',
      'pages.helpCenter.articles.securityBasics.content.1',
      'pages.helpCenter.articles.securityBasics.content.2'
    ],
    tagKeys: [
      'pages.helpCenter.tags.security',
      'pages.helpCenter.tags.privacy',
      'pages.helpCenter.tags.trust'
    ],
    categoryKey: 'pages.helpCenter.categories.safety'
  },
  {
    id: 'report-issue',
    titleKey: 'pages.helpCenter.articles.reportIssue.title',
    summaryKey: 'pages.helpCenter.articles.reportIssue.summary',
    contentKeys: [
      'pages.helpCenter.articles.reportIssue.content.0',
      'pages.helpCenter.articles.reportIssue.content.1',
      'pages.helpCenter.articles.reportIssue.content.2'
    ],
    tagKeys: [
      'pages.helpCenter.tags.safety',
      'pages.helpCenter.tags.support'
    ],
    categoryKey: 'pages.helpCenter.categories.safety'
  },
  {
    id: 'account-access',
    titleKey: 'pages.helpCenter.articles.accountAccess.title',
    summaryKey: 'pages.helpCenter.articles.accountAccess.summary',
    contentKeys: [
      'pages.helpCenter.articles.accountAccess.content.0',
      'pages.helpCenter.articles.accountAccess.content.1',
      'pages.helpCenter.articles.accountAccess.content.2'
    ],
    tagKeys: [
      'pages.helpCenter.tags.account',
      'pages.helpCenter.tags.login'
    ],
    categoryKey: 'pages.helpCenter.categories.account'
  }
];

export const popularGuides = [
  'donate-guest',
  'organizer-verification',
  'campaign-draft',
  'donation-receipts',
  'campaign-updates',
  'report-issue'
];

export const faqs = [
  {
    qKey: 'pages.helpCenter.faqs.0.q',
    aKey: 'pages.helpCenter.faqs.0.a'
  },
  {
    qKey: 'pages.helpCenter.faqs.1.q',
    aKey: 'pages.helpCenter.faqs.1.a'
  },
  {
    qKey: 'pages.helpCenter.faqs.2.q',
    aKey: 'pages.helpCenter.faqs.2.a'
  },
  {
    qKey: 'pages.helpCenter.faqs.3.q',
    aKey: 'pages.helpCenter.faqs.3.a'
  },
  {
    qKey: 'pages.helpCenter.faqs.4.q',
    aKey: 'pages.helpCenter.faqs.4.a'
  },
  {
    qKey: 'pages.helpCenter.faqs.5.q',
    aKey: 'pages.helpCenter.faqs.5.a'
  }
];
