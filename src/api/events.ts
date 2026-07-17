import { apiGet, apiPost, type ApiRequestOptions } from './client';
import { USE_MOCK_API } from './config';
import { MOCK_EVENTS } from '../mocks/events';
import type { EventDetail, EventRegistrationRequest, EventRegistrationResponse } from '../types/event';
import { assertApiData, isEventDetail, isRecord } from './validators';

const isRegistrationResponse = (value: unknown): value is EventRegistrationResponse => isRecord(value)
  && typeof value.registrationId === 'string'
  && (value.status === 'payment_pending' || value.status === 'confirmed')
  && (value.paymentUrl === undefined || typeof value.paymentUrl === 'string');

export async function getEvent(id: string, options?: ApiRequestOptions): Promise<EventDetail> {
  if (!USE_MOCK_API) return assertApiData(await apiGet<unknown>(`/api/events/${encodeURIComponent(id)}`, options), isEventDetail, '活動');
  const event = MOCK_EVENTS.find((item) => item.id === id);
  if (!event) throw new Error('找不到活動資料');
  return event;
}

export async function registerForEvent(
  eventId: string,
  payload: EventRegistrationRequest,
  idempotencyKey: string,
  options?: ApiRequestOptions,
): Promise<EventRegistrationResponse> {
  if (!USE_MOCK_API) {
    const response = await apiPost<unknown>(
      `/api/events/${encodeURIComponent(eventId)}/registrations`,
      payload,
      { ...options, headers: { ...options?.headers, 'Idempotency-Key': idempotencyKey } },
    );
    return assertApiData(response, isRegistrationResponse, '活動報名');
  }

  return {
    registrationId: `mock-registration-${Date.now()}`,
    status: 'payment_pending',
  };
}
