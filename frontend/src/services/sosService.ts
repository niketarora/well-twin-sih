import { apiFetch } from './apiClient';
import type { SosRequest, SosResponse } from '../types/sos';

// Manual SOS is safety-critical: it must never silently fall back to mock data.
// A success state may only come from a genuine POST /api/v1/sos response - any
// failure (network, 4xx, 5xx, timeout) must propagate to the caller as an error.
export const sosService = {
  async sendSos(payload: SosRequest): Promise<SosResponse> {
    return apiFetch<SosResponse>('/sos', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
