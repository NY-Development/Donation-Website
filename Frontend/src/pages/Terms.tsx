import React from 'react';

// Terms and Conditions content customized for Donations Platform (Impact Donation Website)
function boldifyDoubleAsterisk(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

const rawTermsContent = boldifyDoubleAsterisk(`
  <h1>TERMS AND CONDITIONS</h1>
  <p>Last updated: <span class="font-semibold text-gray-700">February 27, 2026</span></p>

  <p>These Terms and Conditions ("Terms") govern your use of the Donations Platform, including the website at <a href="https://donations-platform.example.com" class="text-blue-600 hover:text-orange-600 transition-colors">https://donations-platform.example.com</a> and the associated mobile application (collectively, the "Service"), provided by <span class="font-semibold text-orange-600">Donations Platform</span> ("we," "us," or "our").</p>

  <p class="mt-6 bg-orange-50 p-4 border-l-4 border-orange-500 text-gray-800">
    By accessing or using the Service, you agree to be bound by these Terms. Our Service functions as an intermediary platform connecting verified beneficiaries with global donors. We are not a bank, charity, or insurance provider.
  </p>

  <h2 id="table-of-contents">TABLE OF CONTENTS</h2>
  <ol class="list-decimal list-inside space-y-2 text-gray-700 p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
    <li><a href="#1-acceptance-of-terms" class="text-blue-600 hover:text-orange-600 transition-colors">ACCEPTANCE OF TERMS</a></li>
    <li><a href="#2-user-accounts-and-registration" class="text-blue-600 hover:text-orange-600 transition-colors">USER ACCOUNTS AND REGISTRATION</a></li>
    <li><a href="#3-donations-and-payment-processing" class="text-blue-600 hover:text-orange-600 transition-colors">DONATIONS AND PAYMENT PROCESSING</a></li>
    <li><a href="#4-beneficiary-verification-and-fraud" class="text-blue-600 hover:text-orange-600 transition-colors">BENEFICIARY VERIFICATION AND FRAUD</a></li>
    <li><a href="#5-ai-moderation-and-risk-scoring" class="text-blue-600 hover:text-orange-600 transition-colors">AI MODERATION AND RISK SCORING</a></li>
    <li><a href="#6-user-generated-content" class="text-blue-600 hover:text-orange-600 transition-colors">USER-GENERATED CONTENT</a></li>
    <li><a href="#7-intellectual-property" class="text-blue-600 hover:text-orange-600 transition-colors">INTELLECTUAL PROPERTY</a></li>
    <li><a href="#8-termination" class="text-blue-600 hover:text-orange-600 transition-colors">TERMINATION</a></li>
    <li><a href="#9-disclaimer-of-warranties" class="text-blue-600 hover:text-orange-600 transition-colors">DISCLAIMER OF WARRANTIES</a></li>
    <li><a href="#10-limitation-of-liability" class="text-blue-600 hover:text-orange-600 transition-colors">LIMITATION OF LIABILITY</a></li>
    <li><a href="#11-governing-law" class="text-blue-600 hover:text-orange-600 transition-colors">GOVERNING LAW</a></li>
    <li><a href="#12-contact-us" class="text-blue-600 hover:text-orange-600 transition-colors">CONTACT US</a></li>
  </ol>

  <h2 id="1-acceptance-of-terms">1. ACCEPTANCE OF TERMS</h2>
  <p>By using the Service, you confirm that you are at least 18 years old or accessing the Service under the supervision of a parent or legal guardian. You agree that these Terms constitute a binding legal agreement between you and the Donations Platform regarding your use of our crowdfunding and verification systems.</p>

  <h2 id="2-user-accounts-and-registration">2. USER ACCOUNTS AND REGISTRATION</h2>
  <p>To access the Service as a Donor or Beneficiary, you must register for an account. You agree to:</p>
  <ul class="list-disc ml-6 space-y-1">
      <li>Provide accurate and complete registration information, including identity documentation for beneficiaries.</li>
      <li>Maintain the security of your account and hashed password.</li>
      <li>Notify us immediately of any unauthorized use or security breach.</li>
  </ul>
  <p>We reserve the right to suspend or terminate accounts that provide misleading information or fail our identity verification protocols.</p>

  <h2 id="3-donations-and-payment-processing">3. DONATIONS AND PAYMENT PROCESSING</h2>
  <h3>Intermediary Status</h3>
  <p>Donations Platform is a SaaS intermediary. We do not hold funds directly. All financial transactions are processed through third-party providers (e.g., Stripe, PayPal). By donating, you agree to the terms of these third-party processors.</p>

  <h3>Donation Finality</h3>
  <p>All donations are voluntary and generally non-refundable. Because funds are often disbursed quickly to verified beneficiaries in hardship, donors acknowledge that the platform cannot guarantee a return of funds once a transaction is completed, except in proven cases of fraud as determined by our internal review.</p>

  <h2 id="4-beneficiary-verification-and-fraud">4. BENEFICIARY VERIFICATION AND FRAUD</h2>
  <p>To maintain platform trust, all beneficiaries must undergo a mandatory authentication process:</p>
  <ul class="list-disc ml-6 space-y-1">
      <li>**Verification:** Beneficiaries must provide government-issued IDs and, where applicable, medical documentation or hardship proof.</li>
      <li>**Anti-Manipulation:** We monitor all campaigns for fraud or manipulation. If a campaign is found to be fraudulent, we reserve the right to freeze payouts and cooperate with relevant legal authorities.</li>
      <li>**Transparency:** Beneficiaries are required to provide periodic updates on campaign tracking and fund usage.</li>
  </ul>

  <h2 id="5-ai-moderation-and-risk-scoring">5. AI MODERATION AND RISK SCORING</h2>
  <p>We utilize AI-powered systems to ensure the safety of our global community:</p>
  <ul class="list-disc ml-6 space-y-1">
      <li>**Risk Scoring:** AI models analyze campaigns for risk patterns, potentially impacting campaign approval or withdrawal controls.</li>
      <li>**Anomaly Detection:** Our system monitors donation patterns for signs of money laundering or automated fraud.</li>
      <li>**Appeals:** If an AI decision results in an account suspension, users may request a human review of the automated findings.</li>
  </ul>

  <h2 id="6-user-generated-content">6. USER-GENERATED CONTENT</h2>
  <p>When you create a campaign or upload content (medical proof, photos, videos), you grant Donations Platform a non-exclusive, global, royalty-free license to host and display this content to facilitate your fundraising. You represent that you have the right to share this documentation and that it does not violate any third-party privacy rights.</p>

  <h2 id="7-intellectual-property">7. INTELLECTUAL PROPERTY</h2>
  <p>The Service and its original content, including our proprietary verification algorithms and AI risk-scoring systems, remain the exclusive property of Donations Platform. You may not use our branding or technical assets without express written consent.</p>

  <h2 id="8-termination">8. TERMINATION</h2>
  <p>We may terminate or suspend your access immediately, without prior notice, for conduct that we believe violates these Terms, specifically regarding fraud, misrepresentation of medical hardship, or financial manipulation. Upon termination, your right to host campaigns or process donations will cease.</p>

  <h2 id="9-disclaimer-of-warranties">9. DISCLAIMER OF WARRANTIES</h2>
  <p>The Service is provided on an "AS IS" basis. We do not guarantee that every campaign is 100% accurate, though we perform rigorous verification. Your use of the Service, whether as a donor or beneficiary, is at your sole risk. We disclaim all warranties of merchantability or fitness for a specific medical purpose.</p>

  <h2 id="10-limitation-of-liability">10. LIMITATION OF LIABILITY</h2>
  <p class="font-extrabold text-lg text-red-700 bg-red-100 p-4 rounded-md">IN NO EVENT SHALL DONATIONS PLATFORM, ITS DIRECTORS, OR EMPLOYEES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES RESULTING FROM FRAUDULENT ACTIONS BY THIRD-PARTY USERS, MEDICAL OUTCOMES OF BENEFICIARIES, OR THE LOSS OF DONATED FUNDS THROUGH THIRD-PARTY PAYMENT GATEWAYS.</p>

  <h2 id="11-governing-law">11. GOVERNING LAW</h2>
  <p>These Terms shall be governed by the laws of the **State of Delaware, USA** (or other selected jurisdiction), without regard to its conflict of law provisions. We also comply with international standards including GDPR and CCPA where applicable.</p>

  <h2 id="12-contact-us">12. CONTACT US</h2>
  <p>If you have any questions about these Terms, please contact us:</p>
  <ul class="list-disc ml-6 space-y-1">
      <li>By email: <a href="mailto:support@donationsplatform.com" class="text-blue-600 hover:underline">support@donationsplatform.com</a></li>
      <li>By post: Donations Platform Legal Dept, 123 Impact Way, Delaware, USA</li>
  </ul>
`);

const TermsPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto shadow-xl rounded-2xl p-8 lg:p-12 bg-gray-50 border border-gray-100">
        <div
          className="prose prose-lg max-w-none terms-content-styles"
          dangerouslySetInnerHTML={{ __html: rawTermsContent }}
        />
      </div>
      <style jsx="true">{`
        html {
          scroll-behavior: smooth;
        }
        .terms-content-styles h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--color-primary, #6D28D9);
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 4px solid var(--color-primary, #6D28D9);
          line-height: 1.2;
          letter-spacing: -0.02em;
          animation: fadeIn 1s;
        }
        .terms-content-styles .font-semibold.text-orange-600 {
          color: var(--color-primary, #6D28D9) !important;
        }
        .terms-content-styles h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary-dark, #4C1D95);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          padding-top: 1.5rem;
          animation: fadeIn 1s;
        }
        .terms-content-styles h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-surface-heading, #111827);
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          animation: fadeIn 1s;
        }
        .terms-content-styles p {
          line-height: 1.75;
          margin-bottom: 1rem;
          color: var(--color-surface-body, #4B5563);
          animation: fadeIn 1s;
        }
        .terms-content-styles ol, .terms-content-styles ul {
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .terms-content-styles li {
          margin-bottom: 0.5rem;
          animation: fadeIn 1s;
        }
        .terms-content-styles ol a {
          font-weight: 600;
          text-decoration: none;
          color: var(--color-primary, #6D28D9);
          transition: color 0.3s;
        }
        .terms-content-styles ol a:hover {
          text-decoration: underline;
          color: var(--color-accent-gold, #F59E0B);
        }
        .terms-content-styles .font-extrabold {
          color: var(--color-accent-gold, #F59E0B);
        }
        .terms-content-styles .bg-orange-50 {
          background: var(--color-background-light, #F9FAFB);
        }
        .terms-content-styles .border-orange-500 {
          border-color: var(--color-primary, #6D28D9);
        }
        .terms-content-styles .text-gray-800 {
          color: var(--color-surface-heading, #111827);
        }
        .terms-content-styles .text-gray-700 {
          color: var(--color-surface-body, #4B5563);
        }
        .terms-content-styles .text-blue-600 {
          color: var(--color-primary, #6D28D9);
        }
        .terms-content-styles .hover\:text-orange-600:hover {
          color: var(--color-accent-gold, #F59E0B);
        }
        .terms-content-styles .bg-gray-50 {
          background: var(--color-background-light, #F9FAFB);
        }
        .terms-content-styles .border-gray-200 {
          border-color: var(--color-background-glass, rgba(255,255,255,0.7));
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TermsPage;