import apiClient from '@/services/api';
import { it, describe, expect } from 'vitest';
import envConfig from '@/envConfig';

const { API_URL } = envConfig;

describe('apiClient service', () => {
  it('should have the correct default configuration', () => {
    expect(apiClient.defaults.baseURL).toEqual(API_URL);
    expect(apiClient.defaults.withCredentials).toBe(true);
  });
});
