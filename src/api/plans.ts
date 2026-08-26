import type { Plan, DonationFormPayload, DonationResponse } from '../types/donation';
import { MOCK_PLANS } from '../mocks/donationPlans';
import { apiGet, apiPost, type ApiRequestOptions } from './client';
import { USE_MOCK_API } from './config';
import { assertApiData, isPlan, isPlans, isRecord } from './validators';

const isDonationResponse = (value: unknown): value is DonationResponse => isRecord(value)
  && value.success === true && typeof value.donationId === 'string'
  && (value.status === 'pending' || value.status === 'paid' || value.status === 'failed')
  && (value.paymentUrl === undefined || typeof value.paymentUrl === 'string');

// GET /api/plans
export async function getPlans(options?: ApiRequestOptions): Promise<Plan[]> {
  return USE_MOCK_API ? MOCK_PLANS : assertApiData(await apiGet<unknown>('/api/plans', options), isPlans, '奉獻專案列表');
}

export async function getPlan(id: number, options?: ApiRequestOptions): Promise<Plan | undefined> {
  return USE_MOCK_API ? MOCK_PLANS.find((plan) => plan.id === id) : assertApiData(await apiGet<unknown>(`/api/plans/${id}`, options), isPlan, '奉獻專案');
}

export async function submitDonation(
  payload: DonationFormPayload,
  idempotencyKey: string,
  options?: ApiRequestOptions,
): Promise<DonationResponse> {
  if (!USE_MOCK_API) return assertApiData(
    await apiPost<unknown>('/api/donations', payload, {
      ...options,
      headers: { ...options?.headers, 'Idempotency-Key': idempotencyKey },
    }),
    isDonationResponse,
    '奉獻',
  );
  return {
    success: true,
    donationId: `mock-${Date.now()}`,
    status: 'pending',
  };
}
