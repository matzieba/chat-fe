import { useCallback, useEffect, useMemo, useState } from 'react';

import { DEFAULT_QUERY_LIMIT } from '../helpers/query';
import { useQueryState } from './useQueryState';

const DEFAULT_PAGE = 1;

export const usePagination = (defaultLimit: CVT.Maybe<number> = DEFAULT_QUERY_LIMIT) => {

  const [count, setCount] = useState<number>();
  const [qPage, qSetPage] = useQueryState<number>('page');
  const [qLimit, setLimit] = useQueryState<number>('limit');

  const page = qPage ? parseInt(qPage.toString(), 10) : DEFAULT_PAGE;
  const limit = qLimit ? parseInt(qLimit.toString(), 10) : defaultLimit;
  
  const totalPages = useMemo(() => Math.ceil((count || 1) / limit), [count, limit]);

  const offset = useMemo(() => (limit * page) - limit, [page, limit]);

  const setPage = useCallback((number: number) => {
    window.scrollTo(0, 0);
    qSetPage(number);
  }, [qSetPage]);

  useEffect(() => {
    if (count && page > 1 && page > totalPages) {
      setPage(1);
    }
  }, [count, totalPages, page, setPage]);

  return {
    page,
    setPage,
    limit,
    setLimit,
    offset,
    totalPages,
    setCount,
  };
};
