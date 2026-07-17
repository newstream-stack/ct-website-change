import { apiGet, type ApiRequestOptions } from './client';
import { USE_MOCK_API } from './config';
import { getOrders } from './orders';
import type { PaymentResourceType, PaymentStatusResponse } from '../types/payment';
import { assertApiData, isPaymentStatusResponse } from './validators';

export async function getPaymentStatus(
  type: PaymentResourceType,
  reference: string,
  options?: ApiRequestOptions,
): Promise<PaymentStatusResponse> {
  if (!USE_MOCK_API) {
    const response = await apiGet<unknown>(
      `/api/payments/status?type=${encodeURIComponent(type)}&reference=${encodeURIComponent(reference)}`,
      { ...options, cache: 'no-store' },
    );
    const parsed = assertApiData(response, isPaymentStatusResponse, '付款狀態');
    if (parsed.type !== type || parsed.reference !== reference) throw new Error('付款狀態回應與查詢交易不一致');
    return parsed;
  }
  if (type === 'order') {
    const order = (await getOrders(options)).find((item) => item.orderNumber === reference);
    return { type, reference, status: order?.status ?? 'pending' };
  }
  return { type, reference, status: 'pending' };
}
