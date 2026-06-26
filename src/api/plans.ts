// → swap each function body to: return apiGet/apiPost<T>('/api/plans...')
import type { Plan, DonationFormPayload } from '../types/donation';
import { MOCK_PLANS } from '../mocks/donationPlans';

// GET /api/plans/{id}
export async function getPlan(id: number): Promise<Plan | undefined> {
  return MOCK_PLANS.find((p) => p.id === id);
}

// POST /api/donations
// Body: DonationFormPayload
// Response: { success: boolean; donationId: string }
export async function submitDonation(payload: DonationFormPayload): Promise<{ success: boolean }> {
  console.log('[mock] submitDonation', payload);
  return { success: true };
}
