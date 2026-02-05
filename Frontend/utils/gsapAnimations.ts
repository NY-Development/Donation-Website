import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let isRegistered = false;

export const ensureGsap = () => {
  if (!isRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    isRegistered = true;
  }
};

export const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const animatePageIn = (container: HTMLElement, duration = 0.7) => {
  gsap.fromTo(
    container,
    { autoAlpha: 0, y: 20 },
    { autoAlpha: 1, y: 0, duration, ease: 'power3.out', clearProps: 'transform' }
  );
};

export const animateSectionsOnScroll = (sections: HTMLElement[]) => {
  sections.forEach((section) => {
    gsap.from(section, {
      autoAlpha: 0,
      y: 24,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  });
};

export const animateStagger = (targets: Element[], vars: gsap.TweenVars = {}) => {
  if (!targets.length) return;
  gsap.from(targets, {
    autoAlpha: 0,
    y: 12,
    duration: 0.5,
    ease: 'power3.out',
    stagger: 0.06,
    ...vars,
  });
};

export const addHoverScale = (elements: Element[], scale = 1.03) => {
  if (!elements.length) return () => {};

  const cleanups = elements.map((el) => {
    const handleEnter = () => {
      gsap.to(el, { scale, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
    };
    const handleLeave = () => {
      gsap.to(el, { scale: 1, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
    };

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
    };
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
};
