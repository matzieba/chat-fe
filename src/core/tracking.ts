import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';
import { app } from '@cvt/clients/firebaseClient';

const analytics = getAnalytics(app);

export const trackPageview = () => {
  logEvent(analytics, 'page_view', {
    page_path: window.location.pathname,
    page_title: document.title,
    page_location: window.location.href,
  });
};

export const trackSignUp = () => {
  logEvent(analytics, 'sign_up', {
    content_type: 'user',
  });
};

export const trackLogIn = () => {
  logEvent(analytics, 'login', {
    content_type: 'user',
  });
};

export const setUserEmailDimension = (email: string) => {
  setUserProperties(analytics, { email });
};

export const setUserCompanyDimension = (company: string) => {
  setUserProperties(analytics, { company });
};
