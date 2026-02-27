import React from 'react';

// EULA content customized for Donations Platform (Impact Donation Website)
function boldifyDoubleAsterisk(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

const rawEULAContent = boldifyDoubleAsterisk(`
  <h1>End User License Agreement (EULA)</h1>
  <p>Last updated: <span class="font-semibold text-gray-700">February 27, 2026</span></p>

  <h2 id="licensing-agreement">Licensing Agreement</h2>
  <p>The "Donations Platform" (the "Licensed Application") is licensed to You (End-User) by <span class="font-semibold text-purple-600">Donations Platform</span> (the "Licensor"), for use only under the terms of this License Agreement.</p>
  
  <p class="bg-red-50 p-4 border-l-4 border-red-500 text-gray-800 my-6">
    By downloading, accessing, or using the Licensed Application, you indicate that You agree to be bound by all of the terms and conditions of this License Agreement. The platform includes our beneficiary authentication system, donor transaction environment, and AI-powered fraud detection tools.
  </p>
  
  <h2 id="table-of-contents">TABLE OF CONTENTS</h2>
  <ol class="list-decimal list-inside space-y-2 text-gray-700 p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
    <li><a href="#1-scope-of-license" class="text-blue-600 hover:text-purple-600 transition-colors">SCOPE OF LICENSE</a></li>
    <li><a href="#2-technical-requirements" class="text-blue-600 hover:text-purple-600 transition-colors">TECHNICAL REQUIREMENTS</a></li>
    <li><a href="#3-maintenance-and-support" class="text-blue-600 hover:text-purple-600 transition-colors">MAINTENANCE AND SUPPORT</a></li>
    <li><a href="#4-use-of-data" class="text-blue-600 hover:text-purple-600 transition-colors">USE OF DATA</a></li>
    <li><a href="#5-user-generated-content" class="text-blue-600 hover:text-purple-600 transition-colors">USER-GENERATED CONTENT</a></li>
    <li><a href="#6-contribution-license" class="text-blue-600 hover:text-purple-600 transition-colors">CONTRIBUTION LICENSE</a></li>
    <li><a href="#7-liability" class="text-blue-600 hover:text-purple-600 transition-colors">LIABILITY</a></li>
    <li><a href="#8-warranty" class="text-blue-600 hover:text-purple-600 transition-colors">WARRANTY</a></li>
    <li><a href="#9-product-claims" class="text-blue-600 hover:text-purple-600 transition-colors">PRODUCT CLAIMS</a></li>
    <li><a href="#10-legal-compliance" class="text-blue-600 hover:text-purple-600 transition-colors">LEGAL COMPLIANCE</a></li>
    <li><a href="#11-termination" class="text-blue-600 hover:text-purple-600 transition-colors">TERMINATION</a></li>
    <li><a href="#12-third-party-terms" class="text-blue-600 hover:text-purple-600 transition-colors">THIRD-PARTY TERMS OF AGREEMENTS</a></li>
    <li><a href="#13-contact-information" class="text-blue-600 hover:text-purple-600 transition-colors">CONTACT INFORMATION</a></li>
    <li><a href="#14-miscellaneous" class="text-blue-600 hover:text-purple-600 transition-colors">MISCELLANEOUS</a></li>
  </ol>

  <h2 id="1-scope-of-license">1. SCOPE OF LICENSE</h2>
  <p>Licensor grants You a non-transferable, non-exclusive, non-sublicensable license to install and use the Licensed Application on any devices that You own or control. This license governs any updates provided by Licensor that replace or supplement the original Application. You may not distribute, lease, lend, sell, or decompile the Application's proprietary verification or AI risk-scoring algorithms.</p>

  <h2 id="2-technical-requirements">2. TECHNICAL REQUIREMENTS</h2>
  <p>The Licensed Application requires a stable internet connection and compatible browser or mobile OS to function. Beneficiaries may be required to have camera access for biometric verification or document scanning (OCR) to complete the authentication process.</p>

  <h2 id="3-maintenance-and-support">3. MAINTENANCE AND SUPPORT</h2>
  <p>Licensor is solely responsible for providing any maintenance and support services for this Licensed Application. You acknowledge that third-party platform providers (e.g., Apple, Google) have no obligation to furnish maintenance or support for the Application.</p>

  <h2 id="4-use-of-data">4. USE OF DATA</h2>
  <p>You acknowledge that Licensor will be able to access and adjust Your personal data and technical data (including medical documentation provided for verification) to provide the Services. Use of data is governed by our Privacy Policy. Our AI systems may process this data for fraud detection, campaign risk scoring, and anomaly detection.</p>

  <h2 id="5-user-generated-content">5. USER-GENERATED CONTENT</h2>
  <p>The Application allows you to create fundraising campaigns, upload images, and provide medical or hardship proof. You are responsible for the content you upload. You represent that you have all necessary rights and consents to upload sensitive personal or medical information for the purpose of verifying your campaign.</p>

  <h2 id="6-contribution-license">6. CONTRIBUTION LICENSE</h2>
  <p>By posting contributions (campaigns, updates, photos), you automatically grant us an irrevocable, perpetual, non-exclusive, transferable, royalty-free, worldwide license to use, copy, and display such content for the operation and promotion of your campaign and the platform’s trust-centered ecosystem.</p>

  <h2 id="7-liability">7. LIABILITY</h2>
  <p>Licensor’s liability for any breach of duty or negligence is limited to the amount of platform fees collected from your specific account in the last six months. Licensor is not liable for the misuse of funds by beneficiaries or for the inaccuracy of third-party medical documentation provided by users.</p>

  <h2 id="8-warranty">8. WARRANTY</h2>
  <p>The Licensed Application is provided "as is." Licensor warrants that the Application will perform substantially as described; however, we do not warrant that the fraud detection system will be 100% error-free. In the event of a failure to conform to any applicable warranty, you may notify the platform for support or potential donation dispute resolution.</p>

  <h2 id="9-product-claims">9. PRODUCT CLAIMS</h2>
  <p>You acknowledge that Licensor, not third-party service providers, is responsible for addressing any claims relating to the Licensed Application, including but not limited to: (i) product liability claims; (ii) any claim that the Application fails to conform to any applicable legal or regulatory requirement; and (iii) claims arising under consumer protection laws.</p>

  <h2 id="10-legal-compliance">10. LEGAL COMPLIANCE</h2>
  <p>You represent and warrant that (i) You are not located in a country that is subject to a U.S. Government embargo; and (ii) You are not listed on any U.S. Government list of prohibited or restricted parties. You agree to comply with all global anti-money laundering (AML) and "Know Your Customer" (KYC) regulations applicable to your jurisdiction.</p>

  <h2 id="11-termination">11. TERMINATION</h2>
  <p>The license is effective until terminated by You or Licensor. Your rights under this license will terminate automatically if you fail to pass our AI risk-scoring verification, provide fraudulent medical documentation, or violate any terms of this Agreement.</p>

  <h2 id="12-third-party-terms">12. THIRD-PARTY TERMS OF AGREEMENTS</h2>
  <p>You must comply with applicable third-party terms of agreement when using the Licensed Application, including those of your payment processor (Stripe/PayPal) and your wireless data service provider.</p>

  <h2 id="13-contact-information">13. CONTACT INFORMATION</h2>
  <p>For questions, complaints, or claims with respect to the Licensed Application, please contact:</p>
  <p>
    **Donations Platform Legal Department**<br />
    Email: <a href="mailto:legal@donationsplatform.com" class="text-blue-600 hover:underline">legal@donationsplatform.com</a><br />
    Address: 123 Impact Way, Delaware, USA
  </p>

  <h2 id="14-miscellaneous">14. MISCELLANEOUS</h2>
  <p>If any provision of this Agreement is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced. This Agreement constitutes the entire agreement between the parties regarding the license of the Donations Platform.</p>
`);

const EULA: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto shadow-xl rounded-2xl p-8 lg:p-12 bg-gray-50 border border-gray-100">
        <div
          className="prose prose-lg max-w-none eula-content-styles"
          dangerouslySetInnerHTML={{ __html: rawEULAContent }}
        />
      </div>
      <style jsx="true">{`
        html {
          scroll-behavior: smooth;
        }
        .eula-content-styles h1 {
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
        .eula-content-styles h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary-dark, #4C1D95);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          padding-top: 1.5rem;
          animation: fadeIn 1s;
        }
        .eula-content-styles p {
          line-height: 1.75;
          margin-bottom: 1rem;
          color: var(--color-surface-body, #4B5563);
          animation: fadeIn 1s;
        }
        .eula-content-styles ol, .eula-content-styles ul {
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .eula-content-styles li {
          margin-bottom: 0.5rem;
          animation: fadeIn 1s;
        }
        .eula-content-styles a {
          font-weight: 600;
          text-decoration: none;
          color: var(--color-primary, #6D28D9);
          transition: color 0.3s;
        }
        .eula-content-styles a:hover {
          text-decoration: underline;
          color: var(--color-accent-gold, #F59E0B);
        }
        .eula-content-styles .font-extrabold {
          color: var(--color-accent-gold, #F59E0B);
        }
        .eula-content-styles .bg-red-50 {
          background: var(--color-background-light, #F9FAFB);
        }
        .eula-content-styles .border-red-500 {
          border-color: var(--color-primary, #6D28D9);
        }
        .eula-content-styles .text-gray-800 {
          color: var(--color-surface-heading, #111827);
        }
        .eula-content-styles .text-gray-700 {
          color: var(--color-surface-body, #4B5563);
        }
        .eula-content-styles .text-blue-600 {
          color: var(--color-primary, #6D28D9);
        }
        .eula-content-styles .hover\:text-orange-600:hover {
          color: var(--color-accent-gold, #F59E0B);
        }
        .eula-content-styles .bg-gray-50 {
          background: var(--color-background-light, #F9FAFB);
        }
        .eula-content-styles .border-gray-200 {
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

export default EULA;