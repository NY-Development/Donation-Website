
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Donate: React.FC = () => {
  const [amount, setAmount] = useState('50');
  const navigate = useNavigate();

  const handleDonate = () => {
    navigate('/success');
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">
              Complete your donation
            </h1>
            <div className="flex items-center gap-2 text-primary font-medium">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <p>Secure, encrypted transaction</p>
            </div>
          </div>

          {/* Step 1: Amount */}
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-primary/5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs">1</span>
                Choose an amount
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {['25', '50', '100', '250'].map(val => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`flex items-center justify-center py-4 rounded-lg border-2 font-bold text-lg transition-all ${
                      amount === val 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-gray-100 dark:border-gray-700 bg-transparent text-gray-500 hover:border-primary/50'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Other amount"
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Information */}
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-primary/5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs">2</span>
                Who is donating?
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">First Name</label>
                <input className="w-full px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="Jane" type="text" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">Last Name</label>
                <input className="w-full px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="Doe" type="text" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold">Email Address</label>
                <input className="w-full px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="jane@example.com" type="email" />
                <p className="text-xs text-gray-500">We'll send your tax receipt to this email.</p>
              </div>
            </div>
          </div>

          {/* Step 3: Payment */}
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-primary/5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs">3</span>
                Payment Details
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">Card Number</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">credit_card</span>
                  <input className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="0000 0000 0000 0000" type="text" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input className="w-full px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="MM/YY" type="text" />
                <input className="w-full px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="CVC" type="text" />
              </div>
            </div>
            <div className="px-6 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-4">
              <button 
                onClick={handleDonate}
                className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Donate ${amount} Now</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="w-full aspect-video relative bg-gradient-to-br from-green-400 to-emerald-700 flex items-end p-4">
                <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded text-white text-xs font-bold uppercase tracking-wider">
                  Environment
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Supporting</p>
                  <h3 className="text-xl font-bold leading-tight">Reforestation Project: Amazon</h3>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex gap-3 items-start text-sm">
                    <span className="material-symbols-outlined text-primary">forest</span>
                    <div>
                      <p className="font-semibold">Your impact</p>
                      <p className="text-gray-500">Your ${amount} donation helps plant trees and restore biodiversity.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Donation</span>
                    <span className="font-medium">${Number(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100 dark:border-gray-800">
                    <span>Total Due</span>
                    <span>${Number(amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
