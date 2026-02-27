// Add smooth scroll behavior for the whole page
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth';
}
import React from 'react';

function boldifyDoubleAsterisk(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

const rawPrivacyContent = boldifyDoubleAsterisk(`...raw content here...`);

const PrivacyPolicy: React.FC = () => {
  return (
    <div className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-inter ${document.documentElement.classList.contains('dark') ? 'bg-gray-900' : 'bg-white'}`}> 
      <div className={`max-w-4xl mx-auto shadow-xl rounded-2xl p-8 lg:p-12 ${document.documentElement.classList.contains('dark') ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border border-gray-100'}`}> 
        <div className="prose prose-lg max-w-none privacy-content-styles">
          <main>
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-2">DONATIONS PLATFORM PRIVACY POLICY</h1>
              <p className="text-sm text-gray-500 font-medium">Last updated: February 27, 2026</p>
            </header>
            <section className="mb-8">
              <p className="mb-4">
                This Privacy Notice for <strong>Donations Platform</strong> (<strong>"we," "us," or "our"</strong>), describes how and why we might access, collect, store, use, and/or share (<strong>"process"</strong>) your personal information when you use our services (<strong>"Services"</strong>), including when you:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Visit our website at <strong>[Your-Platform-URL]</strong> or any website of ours that links to this Privacy Notice.</li>
                <li>Download and use our mobile application (<strong>Donations Platform</strong>) or any other application of ours that links to this Privacy Notice.</li>
                <li>Engage with us in other related ways, including any beneficiary verification, fundraising campaigns, donor transactions, or events.</li>
              </ul>
              <p className="mb-4">
                <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <strong>[Your-Support-Email]</strong>.
              </p>
            </section>
            <hr className="my-8" />
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2">SUMMARY OF KEY POINTS</h2>
              <p className="italic mb-4">This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by using our table of contents below to find the section you are looking for.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we process account information, identity verification data (for beneficiaries), financial transaction history, and technical usage data.</li>
                <li><strong>Do we process any sensitive personal information?</strong> Yes. Because medical-related documentation and government IDs are required to verify campaigns, we handle sensitive personal data with enhanced encryption and strict access controls.</li>
                <li><strong>Do we collect any information from third parties?</strong> We collect information from identity verification providers, payment processors (e.g., Stripe, PayPal), and social media platforms if you choose to link your account.</li>
                <li><strong>How do we process your information?</strong> We process your information to facilitate global donations, verify beneficiary authenticity, prevent fraud using AI-powered risk scoring, and maintain a trust-centered impact platform.</li>
                <li><strong>In what situations and with which parties do we share personal information?</strong> We share information with payment processors, verification services, and AI model providers used for fraud detection.</li>
                <li><strong>How do we keep your information safe?</strong> We have implemented advanced organizational and technical procedures to protect your high-risk data, though no electronic transmission is 100% secure.</li>
                <li><strong>What are your rights?</strong> Depending on your location (e.g., EU/UK under GDPR or California under CCPA), you have specific rights regarding your personal information, including the right to appeal AI-driven decisions.</li>
              </ul>
            </section>
            <hr className="my-8" />
            <nav className="mb-8">
              <h2 className="text-xl font-semibold mb-2">TABLE OF CONTENTS</h2>
              <ol className="list-decimal pl-6 space-y-1">
                <li><a className="text-blue-600 underline" href="#infocollect">WHAT INFORMATION DO WE COLLECT?</a></li>
                <li><a className="text-blue-600 underline" href="#infouse">HOW DO WE PROCESS YOUR INFORMATION?</a></li>
                <li><a className="text-blue-600 underline" href="#whoshare">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></li>
                <li><a className="text-blue-600 underline" href="#cookies">DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</a></li>
                <li><a className="text-blue-600 underline" href="#sociallogins">HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a></li>
                <li><a className="text-blue-600 underline" href="#inforetain">HOW LONG DO WE KEEP YOUR INFORMATION?</a></li>
                <li><a className="text-blue-600 underline" href="#infosafe">HOW DO WE KEEP YOUR INFORMATION SAFE?</a></li>
                <li><a className="text-blue-600 underline" href="#infominors">DO WE COLLECT INFORMATION FROM MINORS?</a></li>
                <li><a className="text-blue-600 underline" href="#privacyrights">WHAT ARE YOUR PRIVACY RIGHTS?</a></li>
                <li><a className="text-blue-600 underline" href="#dnt">CONTROLS FOR DO-NOT-TRACK FEATURES</a></li>
                <li><a className="text-blue-600 underline" href="#california">DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</a></li>
                <li><a className="text-blue-600 underline" href="#updates">DO WE MAKE UPDATES TO THIS NOTICE?</a></li>
                <li><a className="text-blue-600 underline" href="#contact">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a></li>
                <li><a className="text-blue-600 underline" href="#request">HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a></li>
              </ol>
            </nav>
            <hr className="my-8" />
            <section className="mb-8">
              <h2 id="infocollect" className="text-lg font-bold mb-2" style={{scrollMarginTop: '96px'}}>1. WHAT INFORMATION DO WE COLLECT?</h2>
              <h3 className="font-semibold mb-1">Personal information you disclose to us</h3>
              <ul className="list-disc pl-6 mb-2">
                <li><strong>Account Information:</strong> Full name, email address, hashed password, and profile photo.</li>
                <li><strong>Identity Verification Data (Beneficiaries):</strong> Government-issued ID, medical documentation, and supporting proof of hardship. We may also collect biometric data (e.g., selfie verification) to prevent fraud.</li>
                <li><strong>Financial & Payment Data:</strong> Payment processing is handled via third parties (Stripe/PayPal). We store transaction history (amount, date, campaign) and payout details for beneficiaries but do not store full credit card numbers.</li>
                <li><strong>User-Generated Content:</strong> Campaign descriptions, uploaded images/videos, and communication sent through platform support or messaging features.</li>
              </ul>
              <h3 className="font-semibold mb-1">Information automatically collected</h3>
              <ul className="list-disc pl-6">
                <li><strong>Technical Data:</strong> IP address, device information, browser type, cookies, and login timestamps.</li>
                <li><strong>AI & Security Logs:</strong> AI-powered fraud detection logs, risk scores, and anomaly detection patterns.</li>
              </ul>
            </section>
            <hr className="my-8" />
            <section className="mb-8">
              <h2 id="infouse" className="text-lg font-bold mb-2" style={{scrollMarginTop: '96px'}}>2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
              <p className="mb-2">We process your information for the following purposes:</p>
              <ul className="list-disc pl-6">
                <li><strong>Facilitating Campaigns:</strong> To allow beneficiaries to create authenticated fundraising campaigns.</li>
                <li><strong>Verification & Trust:</strong> To verify the identity of beneficiaries and the legitimacy of medical claims to prevent platform manipulation.</li>
                <li><strong>AI-Powered Security:</strong> To use AI risk scoring for fraud prevention and campaign approval.</li>
                <li><strong>Processing Donations:</strong> To facilitate the secure transfer of funds between donors and beneficiaries.</li>
                <li><strong>Legal Compliance:</strong> To comply with anti-money laundering (AML) and "Know Your Customer" (KYC) regulations.</li>
              </ul>
            </section>
            <hr className="my-8" />
            <section className="mb-8">
              <h2 id="whoshare" className="text-lg font-bold mb-2" style={{scrollMarginTop: '96px'}}>3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
              <p className="mb-2">We may share your data in the following situations:</p>
              <ul className="list-disc pl-6">
                <li><strong>Payment Processors:</strong> Sharing necessary details with Stripe or PayPal to complete transactions.</li>
                <li><strong>Verification Providers:</strong> Sharing identity documents with third-party services to validate authenticity.</li>
                <li><strong>AI Service Providers:</strong> If external AI models are used for risk analysis or content moderation.</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition.</li>
              </ul>
            </section>
            <hr className="my-8" />
            <section className="mb-8">
              <h2 id="cookies" className="text-lg font-bold mb-2" style={{scrollMarginTop: '96px'}}>4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
              <p>We use cookies and similar tracking technologies to access or store information. Detailed information about how we use such technologies is available in our Cookie Notice.</p>
            </section>
            <hr className="my-8" />
            <section className="mb-8">
              <h2 id="sociallogins" className="text-lg font-bold mb-2" style={{scrollMarginTop: '96px'}}>5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h2>
              <p>If you choose to register or log in using a social media account, we may have access to certain profile information (name, email, profile picture) as permitted by the provider.</p>
            </section>
            <hr className="my-8" />
            <section className="mb-8">
              <h2 id="inforetain" className="text-lg font-bold mb-2" style={{scrollMarginTop: '96px'}}>6. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
              <p>We keep your personal information for as long as necessary to fulfill the purposes outlined in this notice, unless a longer retention period is required by law (such as for tax, accounting, or fraud prevention).</p>
            </section>
            <hr className="my-8" />
            <section className="mb-8">
              <h2 id="infosafe" className="text-lg font-bold mb-2" style={{scrollMarginTop: '96px'}}>7. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
              <p className="mb-2">Because we handle sensitive medical and identity data, we utilize:</p>
              <ul className="list-disc pl-6">
                <li><strong>Enhanced Encryption:</strong> For all high-risk data at rest and in transit.</li>
                <li><strong>Access Controls:</strong> Restricted internal access to sensitive beneficiary documentation.</li>
                <li><strong>Regular Audits:</strong> Monitoring AI logs for security anomalies.</li>
              </ul>
            </section>
            <hr className="my-8" />
            <section className="mb-8">
              <h2 id="infominors" className="text-lg font-bold mb-2" style={{scrollMarginTop: '96px'}}>8. DO WE COLLECT INFORMATION FROM MINORS?</h2>
              <p>We do not knowingly solicit data from or market to children under 18 years of age. Use of the platform by minors requires explicit parental or guardian consent and management.</p>
            </section>
            <hr className="my-8" />
            <section className="mb-8">
              <h2 id="privacyrights" className="text-lg font-bold mb-2" style={{scrollMarginTop: '96px'}}>9. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
              <p className="mb-2">Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc pl-6">
                <li><strong>Access and Rectification:</strong> Request a copy of your data or correct inaccuracies.</li>
                <li><strong>Data Portability:</strong> Request transfer of your data to another service.</li>
                <li><strong>AI Appeals:</strong> If an AI-driven fraud score results in account suspension or campaign rejection, you have the right to request a <strong>human review</strong>.</li>
              </ul>
            </section>
            <hr className="my-8" />
            <section className="mb-8">
              <h2 id="dnt" className="text-lg font-bold mb-2" style={{scrollMarginTop: '96px'}}>10. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
              <p>Most web browsers include a Do-Not-Track ("DNT") feature. We currently do not respond to DNT signals as no uniform technology standard has been adopted.</p>
            </section>
            <hr className="my-8" />
            <section className="mb-8">
              <h2 id="california" className="text-lg font-bold mb-2" style={{scrollMarginTop: '96px'}}>11. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
              <p>Yes. California residents are granted specific rights under the CCPA regarding access to personal information and the right to opt-out of the "sale" of personal information (which we do not do).</p>
            </section>
            <hr className="my-8" />
            <section className="mb-8">
              <h2 id="updates" className="text-lg font-bold mb-2" style={{scrollMarginTop: '96px'}}>12. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
              <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and will be effective as soon as it is accessible.</p>
            </section>
            <hr className="my-8" />
            <section className="mb-8">
              <h2 id="contact" className="text-lg font-bold mb-2" style={{scrollMarginTop: '96px'}}>13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
              <p>If you have questions or comments about this notice, you may email us at <strong>[Your-Support-Email]</strong> or by post to: <strong>[Your-Legal-Address]</strong>.</p>
            </section>
            <hr className="my-8" />
            <section>
              <h2 id="request" className="text-lg font-bold mb-2" style={{scrollMarginTop: '96px'}}>14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
              <p>Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you. To request a review, update, or deletion, please visit: <strong>[Your-Contact-URL]</strong>.</p>
            </section>
          </main>
        </div>
      </div>
      <style jsx="true">{`
        .privacy-content-styles.dark h1 {
          color: var(--color-primary-dark, #A5B4FC);
          border-bottom: 4px solid var(--color-primary-dark, #A5B4FC);
        }
        .privacy-content-styles.dark h2 {
          color: var(--color-primary-dark, #818CF8);
        }
        .privacy-content-styles.dark h3 {
          color: var(--color-surface-heading-dark, #E0E7FF);
        }
        .privacy-content-styles.dark p {
          color: var(--color-surface-body-dark, #D1D5DB);
        }
        .privacy-content-styles.dark .bg-gray-50 {
          background: var(--color-background-dark, #1F2937);
        }
        .privacy-content-styles.dark .border-gray-200 {
          border-color: var(--color-background-glass-dark, rgba(31,41,55,0.7));
        }
        .privacy-content-styles.dark .text-blue-600 {
          color: var(--color-primary-dark, #A5B4FC);
        }
        .privacy-content-styles.dark .font-extrabold {
          color: var(--color-accent-gold-dark, #FBBF24);
        }
        .privacy-content-styles.dark .text-gray-800 {
          color: var(--color-surface-heading-dark, #E0E7FF);
        }
        .privacy-content-styles.dark .text-gray-700 {
          color: var(--color-surface-body-dark, #D1D5DB);
        }
        .privacy-content-styles.dark .bg-orange-50 {
          background: var(--color-background-dark, #1F2937);
        }
        .privacy-content-styles.dark .border-orange-500 {
          border-color: var(--color-primary-dark, #A5B4FC);
        }
        .privacy-content-styles.dark ol a:hover {
          color: var(--color-accent-gold-dark, #FBBF24);
        }
        .privacy-content-styles.dark {
          background: transparent;
        }
        html {
          scroll-behavior: smooth;
        }
        .privacy-content-styles h1 {
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
        .privacy-content-styles h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary-dark, #4C1D95);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          padding-top: 1.5rem;
          animation: fadeIn 1s;
        }
        .privacy-content-styles h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-surface-heading, #111827);
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          animation: fadeIn 1s;
        }
        .privacy-content-styles p {
          line-height: 1.75;
          margin-bottom: 1rem;
          color: var(--color-surface-body, #4B5563);
          animation: fadeIn 1s;
        }
        .privacy-content-styles ul, .privacy-content-styles ol {
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .privacy-content-styles li {
          margin-bottom: 0.5rem;
          animation: fadeIn 1s;
        }
        .privacy-content-styles ol a {
          font-weight: 600;
          text-decoration: none;
          color: var(--color-primary, #6D28D9);
          transition: color 0.3s;
        }
        .privacy-content-styles ol a:hover {
          text-decoration: underline;
          color: var(--color-accent-gold, #F59E0B);
        }
        .privacy-content-styles .font-extrabold {
          color: var(--color-accent-gold, #F59E0B);
        }
        .privacy-content-styles .bg-orange-50 {
          background: var(--color-background-light, #F9FAFB);
        }
        .privacy-content-styles .border-orange-500 {
          border-color: var(--color-primary, #6D28D9);
        }
        .privacy-content-styles .text-gray-800 {
          color: var(--color-surface-heading, #111827);
        }
        .privacy-content-styles .text-gray-700 {
          color: var(--color-surface-body, #4B5563);
        }
        .privacy-content-styles .text-blue-600 {
          color: var(--color-primary, #6D28D9);
        }
        .privacy-content-styles .hover\:text-orange-600:hover {
          color: var(--color-accent-gold, #F59E0B);
        }
        .privacy-content-styles .bg-gray-50 {
          background: var(--color-background-light, #F9FAFB);
        }
        .privacy-content-styles .border-gray-200 {
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

export default PrivacyPolicy;
