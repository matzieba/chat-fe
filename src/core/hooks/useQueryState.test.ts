import { useLocation, useNavigate } from 'react-router';
import { describe, beforeEach, it, vi, expect, MockedFunction } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';

import { useQueryState } from './useQueryState';

vi.mock('react-router', () => {
  return {
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
  };
});

describe('useQueryState', () => {
  const navigate = vi.fn();
  beforeEach(() => {
    (useLocation as MockedFunction<any>).mockReturnValue({ search: '?name=value' });
    (useNavigate as MockedFunction<any>).mockReturnValue(navigate);
  });

  it('should return the correct initial value', () => {
    const { result } = renderHook(() => useQueryState('name', 'defaultValue'));
    expect(result.current[0]).toBe('value');
  });

  it('should set the correct value', () => {
    const { result } = renderHook(() => useQueryState('name', 'defaultValue'));
    act(() => {
      result.current[1]('newValue');
    });
    expect(navigate).toHaveBeenLastCalledWith({
      search: 'name=newValue',
    });
  });

  it('should remove query when cleared', () => {
    const { result } = renderHook(() => useQueryState('name', 'defaultValue'));
    act(() => {
      result.current[1]('newValue');
    });
    expect(navigate).toHaveBeenLastCalledWith({
      search: 'name=newValue',
    });
    act(() => {
      result.current[1](undefined);
    });
    expect(navigate).toHaveBeenLastCalledWith({
      search: '',
    });
  });

});
