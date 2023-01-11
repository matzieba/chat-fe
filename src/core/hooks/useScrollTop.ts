import { useCallback, useEffect } from 'react';
import { useMount } from 'react-use';
import { useLocation } from 'react-router';

export const useScrollTop = (top = 0) => {

  const { pathname } = useLocation();

  const scrollToTop = useCallback((props?: any) => window.scrollTo(0, top), [top]);

  useMount(() => {
    scrollToTop();
  });

  useEffect(() => {
    scrollToTop(pathname);
  }, [scrollToTop, pathname]);

  return {
    scrollToTop,
  };
};
