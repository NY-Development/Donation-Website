export type HelpArticle = {
  id: string;
  title: string;
  summary: string;
  content: string[];
  tags: string[];
  category: 'account' | 'donations' | 'campaigns' | 'safety' | 'verification';
};

export const helpTopics = ['Donations', 'Receipts', 'Verification', 'Campaign tips', 'Security', 'Account'] as const;

export const helpArticles: HelpArticle[] = [
  {
    id: 'donate-guest',
    title: 'How to donate without logging in',
    summary: 'You can donate as a guest and still support a campaign securely.',
    content: [
      'Open a campaign and tap Donate Now.',
      'Choose your ETB amount and enter your name. Email is optional but helps with receipts and updates.',
      'Submit the donation. If you want, attach a receipt image as proof.',
      'Create an account later to track your impact from the dashboard.'
    ],
    tags: ['donations', 'guest', 'receipts', 'dashboard'],
    category: 'donations'
  },
  {
    id: 'donation-receipts',
    title: 'How to track donations and receipts',
    summary: 'See totals and donation history from your dashboard after you log in.',
    content: [
      'Log in and open your dashboard to view Total Donated and recent activity.',
      'Receipts are attached to successful donations when provided.',
      'If a receipt is missing, submit your donation with a proof image next time for faster tracking.'
    ],
    tags: ['donations', 'receipts', 'dashboard'],
    category: 'donations'
  },
  {
    id: 'organizer-verification',
    title: 'How to verify your organizer account',
    summary: 'Verification protects donors and keeps campaigns trustworthy.',
    content: [
      'Go to Organizer Verification from your dashboard.',
      'Upload your national ID (front and back) and a clear live photo.',
      'Submit the form and wait for approval. You will see the status in your account.'
    ],
    tags: ['verification', 'organizer', 'national id'],
    category: 'verification'
  },
  {
    id: 'campaign-draft',
    title: 'How to create a campaign draft',
    summary: 'Start a campaign and save progress as you go.',
    content: [
      'Open Start Campaign and fill in the title, story, and goal.',
      'Add a deadline if you want the campaign to auto-close on a specific date.',
      'Upload media to make your campaign more credible and engaging.',
      'Launch when ready, or keep editing until you are satisfied.'
    ],
    tags: ['campaigns', 'draft', 'deadline'],
    category: 'campaigns'
  },
  {
    id: 'campaign-updates',
    title: 'How to update your campaign story',
    summary: 'Keep donors informed with clear progress updates.',
    content: [
      'Open your campaign from the dashboard and edit the story or goal as needed.',
      'Add new media to show progress and build trust.',
      'If you need to pause or delete, submit a request from the dashboard.'
    ],
    tags: ['campaigns', 'updates', 'dashboard'],
    category: 'campaigns'
  },
  {
    id: 'campaign-closure',
    title: 'When does a campaign close?',
    summary: 'Campaigns close when the deadline passes or when the goal is reached.',
    content: [
      'If you set a deadline, the campaign closes automatically on that date.',
      'If the goal is reached first, the campaign is marked as a success story and closes.',
      'Closed campaigns no longer accept donations.'
    ],
    tags: ['campaigns', 'deadline', 'goal reached'],
    category: 'campaigns'
  },
  {
    id: 'security-basics',
    title: 'How we keep donations secure',
    summary: 'We use secure sessions, protected routes, and controlled access.',
    content: [
      'Authentication protects personal data and donation history.',
      'Organizer verification reduces fraud risk for campaigns.',
      'We monitor activity and provide support for suspicious issues.'
    ],
    tags: ['security', 'privacy', 'trust'],
    category: 'safety'
  },
  {
    id: 'report-issue',
    title: 'How to report suspicious activity',
    summary: 'Contact support with details so we can help quickly.',
    content: [
      'Use the Report an issue action in the Help Center.',
      'Describe the campaign and any evidence you have.',
      'Our team will review and respond to your report.'
    ],
    tags: ['safety', 'support'],
    category: 'safety'
  },
  {
    id: 'account-access',
    title: 'Account access and recovery',
    summary: 'Log in securely and recover access if needed.',
    content: [
      'Use the login page with your email and password.',
      'If you forgot your password, use the Forgot Password link.',
      'Contact support if you cannot regain access.'
    ],
    tags: ['account', 'login'],
    category: 'account'
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
    q: 'How do I verify my email with OTP?',
    a: 'After signup, we send a 6-digit OTP to your email. Enter it on the verification page to activate your account.'
  },
  {
    q: 'Can I donate without an account?',
    a: 'Yes. You can complete a donation as a guest. Create an account later to track receipts and impact.'
  },
  {
    q: 'Where can I see my total donated?',
    a: 'Log in and open your dashboard to see Total Donated and your donation timeline.'
  },
  {
    q: 'What happens when a campaign reaches its goal?',
    a: 'The campaign is marked as a success story and closes automatically to new donations.'
  },
  {
    q: 'What happens when a campaign deadline passes?',
    a: 'The campaign closes automatically and no longer accepts donations.'
  },
  {
    q: 'How do I report a problem?',
    a: 'Use the Report an issue action in the Help Center to email our support team.'
  }
];
