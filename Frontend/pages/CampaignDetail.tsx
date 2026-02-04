
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <Link className="text-primary hover:underline text-sm font-medium" to="/">Home</Link>
        <span className="text-gray-400 text-sm">/</span>
        <Link className="text-primary hover:underline text-sm font-medium" to="/explore">Campaigns</Link>
        <span className="text-gray-400 text-sm">/</span>
        <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Community</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">
              Help Rebuild the Community Center
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              A safe haven for our neighborhood youth needs urgent repairs after the storm.
            </p>
          </div>

          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm relative group">
            <img 
              src="https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=2070&auto=format&fit=crop" 
              alt="Community Center" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wide">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span>Austin, TX</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
            <div className="flex gap-4 items-center">
              <div className="h-14 w-14 rounded-full bg-cover bg-center bg-gray-200" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop")' }}></div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Sarah Jenkins</p>
                  <span className="material-symbols-outlined text-primary text-base">verified</span>
                </div>
                <p className="text-gray-500 text-sm">Organizer • Verified Charity</p>
              </div>
            </div>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-bold">
              <span className="material-symbols-outlined text-lg">mail</span> Contact
            </button>
          </div>

          <article className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <p className="mb-4">It started with a spark—not of fire, but of hope. For over 30 years, the Eastside Community Center has been a second home to thousands of kids.</p>
            <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-xl text-gray-900 dark:text-white font-medium">
              "This place isn't just a building. It's the heartbeat of our neighborhood."
            </blockquote>
            <p>Every dollar counts. Whether you can give $5 or $500, your contribution directly impacts a child's safety and future. Let's rebuild, together.</p>
          </article>
        </div>

        <div className="lg:col-span-4 relative">
          <div className="sticky top-24 flex flex-col gap-6">
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">$12,450</span>
                    <span className="text-sm text-gray-500 font-medium">raised of $20,000 goal</span>
                  </div>
                  <div className="relative w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: '62%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-gray-500 mt-1">
                    <span>342 donations</span>
                    <span className="flex items-center gap-1 text-orange-500">
                      <span className="material-symbols-outlined text-sm">trending_up</span> 12 today
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[20, 50, 100].map(amt => (
                    <button key={amt} className="py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 text-gray-700 dark:text-gray-200 font-bold transition">
                      ${amt}
                    </button>
                  ))}
                </div>

                <Link to={`/donate/${id}`} className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-lg shadow-lg shadow-primary/20 transition-all text-center">
                  Donate Now
                </Link>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Secure donation via Stripe
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-surface-dark p-6 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">favorite</span> Hero Donors
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">RJ</div>
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Ryan Jacobs</span>
                      <span className="text-xs text-gray-500">Recent donation</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">$50</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">AL</div>
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Anonymous</span>
                      <span className="text-xs text-gray-500">5 mins ago</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">$100</span>
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

export default CampaignDetail;
