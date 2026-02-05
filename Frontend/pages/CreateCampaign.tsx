
import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { addHoverScale, animatePageIn, animateSectionsOnScroll, animateStagger, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { ArrowLeft, ArrowRight, Bold, CheckCircle, Flag, Image, Italic, Lightbulb, Link as LinkIcon, Wallet } from 'lucide-react';

const CreateCampaign: React.FC = () => {
  const [step, setStep] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef(false);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  useLayoutEffect(() => {
    ensureGsap();
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (!hasAnimatedRef.current) {
        animatePageIn(containerRef.current as HTMLDivElement);
        const sections = gsap.utils.toArray<HTMLElement>('[data-animate="section"]', containerRef.current);
        animateSectionsOnScroll(sections);
        hasAnimatedRef.current = true;
      }

      const forms = gsap.utils.toArray<HTMLElement>('[data-animate="form"]', containerRef.current);
      forms.forEach((form) => {
        const inputs = gsap.utils.toArray('[data-animate="input"]', form);
        animateStagger(inputs, {
          y: 12,
          duration: 0.5,
          stagger: 0.06,
          scrollTrigger: {
            trigger: form,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, containerRef);

    const cleanupHover = addHoverScale(
      gsap.utils.toArray('[data-animate="button"]', containerRef.current),
      1.02
    );

    return () => {
      cleanupHover();
      ctx.revert();
    };
  }, [step]);

  return (
    <div ref={containerRef} className="max-w-[1120px] mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      {/* Stepper */}
      <div className="flex justify-center mb-10" data-animate="section">
        <nav className="inline-flex flex-wrap gap-2 md:gap-4 items-center bg-white dark:bg-surface-dark px-6 py-3 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
          {[1, 2, 3, 4].map(s => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${step === s ? 'text-primary font-bold' : step > s ? 'text-green-600' : 'text-gray-400'}`}>
                {step > s ? (
                  <CheckCircle className="size-5" aria-hidden="true" />
                ) : (
                  <span className={`flex items-center justify-center size-5 rounded-full ${step === s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} text-xs`}>
                    {s}
                  </span>
                )}
                <span>{s === 1 ? 'Title' : s === 2 ? 'Story' : s === 3 ? 'Goal' : 'Media'}</span>
              </div>
              {s < 4 && <span className="text-gray-300 dark:text-gray-700">/</span>}
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="mb-8 text-center md:text-left" data-animate="section">
        <p className="text-primary text-sm font-bold uppercase tracking-wider mb-2">Step {step} of 4</p>
        <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">
          {step === 1 && "Let's start with the basics"}
          {step === 2 && "Tell your story"}
          {step === 3 && "Set your fundraising goal"}
          {step === 4 && "Media & Cover Photo"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6" data-animate="section">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-8" data-animate="form">
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <label className="block text-xl font-bold mb-2">Give your campaign a title</label>
                  <p className="text-gray-500 text-sm mb-4">This is the first thing people will see. Make it clear and brief.</p>
                  <input className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-lg outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., Help the Smith Family Rebuild" data-animate="input" />
                </div>
                <div>
                  <label className="block text-xl font-bold mb-2">Select a category</label>
                  <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary outline-none" data-animate="input">
                    <option>Choose a category...</option>
                    <option>Education</option>
                    <option>Medical</option>
                    <option>Environment</option>
                    <option>Emergency</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xl font-bold mb-2">Why are you raising money?</label>
                  <p className="text-gray-500 text-base mb-4">Connect with your audience by sharing details about the cause.</p>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-2 flex gap-1">
                      <Bold className="size-4 p-1 rounded hover:bg-gray-200 cursor-pointer" aria-hidden="true" />
                      <Italic className="size-4 p-1 rounded hover:bg-gray-200 cursor-pointer" aria-hidden="true" />
                      <LinkIcon className="size-4 p-1 rounded hover:bg-gray-200 cursor-pointer" aria-hidden="true" />
                    </div>
                    <textarea 
                      className="w-full min-h-[300px] p-4 bg-white dark:bg-gray-800 border-none outline-none focus:ring-0 resize-none" 
                      placeholder="Hi, my name is [Name] and I am raising funds for..."
                      data-animate="input"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10">
                <div>
                  <label className="block text-xl font-bold mb-4">How much would you like to raise?</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-bold text-gray-300">$</span>
                    <input className="w-full pl-14 pr-20 py-8 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl text-5xl font-black focus:ring-2 focus:ring-primary" defaultValue="10,000" data-animate="input" />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">USD</span>
                  </div>
                </div>
                <div>
                   <h3 className="text-lg font-bold mb-4">Funding Style</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 border-2 border-primary bg-primary/5 rounded-xl flex flex-col gap-2">
                        <Wallet className="size-4 text-primary" aria-hidden="true" />
                        <p className="font-bold">Keep what you raise</p>
                        <p className="text-sm text-gray-500">Keep all donations even if you don't reach the goal.</p>
                      </div>
                      <div className="p-5 border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col gap-2">
                        <Flag className="size-4 text-gray-400" aria-hidden="true" />
                        <p className="font-bold">All or nothing</p>
                        <p className="text-sm text-gray-500">Only receive funds if you reach the target.</p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div>
                   <label className="block text-xl font-bold mb-2">Campaign Cover Photo</label>
                   <div className="mt-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-12 flex flex-col items-center gap-4 text-center">
                     <Image className="size-12 text-gray-300" aria-hidden="true" />
                      <div>
                        <p className="font-bold">Drag and drop your image here</p>
                        <p className="text-xs text-gray-500 mt-1">Recommended: 1200 x 675px • JPG, PNG, GIF</p>
                      </div>
                      <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg font-bold text-sm" data-animate="button">Browse Files</button>
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            {step > 1 ? (
              <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors" data-animate="button">
                <ArrowLeft className="size-4" aria-hidden="true" /> Back
              </button>
            ) : (
              <div />
            )}
            <button 
              onClick={step < 4 ? nextStep : () => window.location.hash = '#/dashboard'} 
              className="w-full sm:w-auto px-10 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2"
              data-animate="button"
            >
              {step === 4 ? 'Launch Campaign' : 'Continue'}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <aside className="lg:col-span-4 w-full" data-animate="section">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-surface-dark dark:to-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
             <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="size-4 text-primary" aria-hidden="true" />
                <h3 className="font-bold text-lg">Tips for success</h3>
             </div>
             <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex gap-2">
                  <CheckCircle className="size-4 text-green-500" aria-hidden="true" />
                  <span><strong>Be descriptive.</strong> Specific titles build more trust.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="size-4 text-green-500" aria-hidden="true" />
                  <span><strong>Share your story.</strong> People donate to people, not just causes.</span>
                </li>
             </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateCampaign;
