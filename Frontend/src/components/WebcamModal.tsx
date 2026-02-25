import React from 'react';
import Webcam from 'react-webcam';

interface WebcamModalProps {
  open: boolean;
  onClose: () => void;
  onCapture: (img: string) => void;
  info?: string;
}

export const WebcamModal: React.FC<WebcamModalProps> = ({ open, onClose, onCapture, info }) => {
  const webcamRef = React.useRef<Webcam>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2">Take a Selfie</h2>
        <p className="text-sm text-gray-500 mb-4 text-center">{info || 'For best results, use your mobile device.'}</p>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="rounded-xl border border-gray-200 dark:border-gray-700 mb-4 w-full h-64 object-cover"
          videoConstraints={{ facingMode: 'user' }}
        />
        <div className="flex gap-3 w-full">
          <button
            className="flex-1 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover"
            onClick={() => {
              const imageSrc = webcamRef.current?.getScreenshot();
              if (imageSrc) onCapture(imageSrc);
            }}
          >
            Capture
          </button>
          <button
            className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
