import React, { useEffect } from 'react';

interface LegalModalProps {
  open: boolean;
  onClose: () => void;
  content: 'privacy' | 'terms';
}

const LegalModal: React.FC<LegalModalProps> = ({ open, onClose, content }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8 animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="overflow-y-auto max-h-[70vh]">
          {content === 'privacy' ? (
            <React.Suspense fallback={<div>Loading...</div>}>
              <PrivacyPolicyModalContent />
            </React.Suspense>
          ) : (
            <React.Suspense fallback={<div>Loading...</div>}>
              <TermsModalContent />
            </React.Suspense>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s;
        }
      `}</style>
    </div>
  );
};

const PrivacyPolicyModalContent = React.lazy(() => import('../pages/PrivacyPolicy'));
const TermsModalContent = React.lazy(() => import('../pages/Terms'));

export default LegalModal;
