import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ActivePage } from '../types';

export const RouteManager: React.FC = () => {
  const location = useLocation();
  const setActivePage = useStore((state) => state.setActivePage);

  useEffect(() => {
    // 1. Scroll to top on route change (Section 1)
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    // 2. Move focus to the page <h1> on every route change (Section 1 & 7)
    setTimeout(() => {
      const heading = document.querySelector('h1');
      if (heading) {
        if (!heading.hasAttribute('tabindex')) {
          heading.setAttribute('tabindex', '-1');
        }
        heading.focus();
      }
    }, 100);

    // 3. Keep activePage in sync in Zustand store
    const path = location.pathname.replace('/app/', '').replace('/', '') as ActivePage;
    const validPages: ActivePage[] = [
      'overview',
      'dashboard',
      'map',
      'predict',
      'optimize',
      'classify',
      'allocate',
      'revenue',
      'assumptions',
    ];

    if (validPages.includes(path)) {
      setActivePage(path);
    } else if (location.pathname === '/' || location.pathname === '') {
      setActivePage('overview');
    }
  }, [location.pathname, setActivePage]);

  return null;
};
