import { describe, beforeEach, it, expect, vi, MockedFunction } from 'vitest';

import { attachOptions } from './baseClient';
import { firebaseClient } from './firebaseClient';

describe('attachOptions', () => {
  let getIdToken: MockedFunction<any>;

  beforeEach(() => {
    // Mocking firebaseClient.getAuth().currentUser?.getIdToken()
    getIdToken = vi.fn().mockResolvedValue('my-token');

    firebaseClient.getAuth = vi.fn().mockImplementation(() => {
      return {
        currentUser: {
          getIdToken,
        },
      };
    });

    // Mocking localStorage
    vi.stubGlobal('localStorage', { getItem: vi.fn().mockReturnValue('en') });  
  });

  it('attaches the correct options to the request when authenticate is true', async () => {
    const options = {
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const authenticate = true;
    const attachedOptions = await attachOptions(options, authenticate);

    expect(attachedOptions).toEqual({
      url: 'https://example.com',
      params: {},
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'Authorization': 'Bearer my-token',
      },
    });
    expect(getIdToken).toHaveBeenCalled();
  });

  it('attaches the correct options to the request when authenticate is false', async () => {
    const options = {
      url: 'https://example.com',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const authenticate = false;
    const attachedOptions = await attachOptions(options, authenticate);

    expect(attachedOptions).toEqual({
      url: 'https://example.com',
      params: {},
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
      },
    });
    expect(firebaseClient.getAuth().currentUser?.getIdToken).not.toHaveBeenCalled();
  });
});
