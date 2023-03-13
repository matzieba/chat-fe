import { useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useMount } from 'react-use';

import { addQuery, parseQuery } from '@cvt/helpers/query';

export const useQueryState = <T = string>(name: string, defaultValue?: T): [CVT.Maybe<T>, (value?: CVT.MaybeNull<T>) => void] => {
  const navigate = useNavigate();
  const location = useLocation();
  const value = useMemo(() => parseQuery(location.search)[name] as CVT.Maybe<T>, [location.search, name]);

  const setValue = useCallback((value?: CVT.MaybeNull<T>) => {
    navigate({
      search: addQuery(window.location.search, {
        [name]: value,
      }),
    });
  }, [navigate, name]);

  useMount(() => {
    if (!value && defaultValue) {
      navigate({
        search: addQuery(window.location.search, {
          [name]: defaultValue,
        }),
      }, { replace: true });
    }
  });

  return [
    value,
    setValue,
  ];
};
