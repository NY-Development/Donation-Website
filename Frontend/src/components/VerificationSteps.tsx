import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface VerificationStepsProps {
  className?: string;
}

const steps = [
  'pages.verificationUpload.step1',
  'pages.verificationUpload.step2',
  'pages.verificationUpload.step3',
];

export const VerificationSteps: React.FC<VerificationStepsProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const location = useLocation();
  let current = 0;
  if (location.pathname.includes('uploadID')) current = 0;
  else if (location.pathname.includes('liveSelfie')) current = 1;
  else if (location.pathname.includes('verPending')) current = 2;

  return (
    <div className={`flex flex-row lg:flex-col items-center lg:items-end gap-4 ${className}`}>
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div className={`flex items-center gap-2 ${current === idx ? 'text-primary font-bold' : idx < current ? 'text-green-600' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${current === idx ? 'bg-primary text-white' : idx < current ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>{idx + 1}</span>
            <span className="hidden lg:inline">{t(step)}</span>
          </div>
          {idx < steps.length - 1 && <span className="hidden lg:block h-8 border-r border-gray-200 dark:border-gray-700 mx-2" />}
        </React.Fragment>
      ))}
    </div>
  );
};
