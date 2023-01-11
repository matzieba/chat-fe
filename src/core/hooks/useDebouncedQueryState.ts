import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useMount } from 'react-use';

import { addQuery, parseQuery } from '../helpers/query';

export const useDebouncedQueryState = <T = string>(name: string, defaultValue?: T, delay: number = 500): [CVT.Maybe<T>, CVT.Maybe<T>, React.Dispatch<React.SetStateAction<T | undefined>>] => {

  const navigate = useNavigate();
  const location = useLocation();
  const timeout = React.useRef<number>();

  const query = React.useMemo(() => {
    const value = parseQuery(location.search)[name];
    return (Array.isArray(value) ? value[0] : value) as unknown as CVT.Maybe<T>;
  }, [location.search, name]);

  const [value, setValue] =React.useState(query);

  const updateHistory = React.useCallback(() => {
    navigate({
      search: addQuery(location.search, {
        [name]: value,
      }),
    });
  }, [navigate, location.search, name, value]);

  React.useEffect(
    () => {
      if (query !== value) {
        timeout.current = window.setTimeout(() => {
          updateHistory();
        }, delay);
      }

      return () => {
        window.clearTimeout(timeout.current);
      };
    },
    [updateHistory, delay, query, value],
  );

  React.useEffect(() => {
    setValue(query);
  }, [query]);

  useMount(() => {
    if (!value && defaultValue) {
      navigate({
        search: addQuery(location.search, {
          [name]: defaultValue,
        }),
      }, { replace: true });

      setValue(defaultValue);
    }
  });

  return [
    value,
    query,
    setValue,
  ];
};
