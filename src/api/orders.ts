import type { ApiRequestOptions } from './client';
import { apiGet, apiPost } from './client';
import { USE_MOCK_API } from './config';
import type { CreateOrderRequest, CreateOrderResponse, Order, OrderStatus, Product } from '../types/product';
import { getProduct } from './products';
import { backfillLegacyProductStock, readJsonStorage, writeJsonStorage } from '../utils/storage';
import { assertApiData, isCreateOrderResponse, isOrders } from './validators';

const MOCK_ORDERS_KEY = 'impact_orders';

function readMockOrders(): Order[] {
  return readJsonStorage(localStorage, MOCK_ORDERS_KEY, [], isOrders, backfillLegacyProductStock);
}

function writeMockOrders(orders: Order[]) {
  writeJsonStorage(localStorage, MOCK_ORDERS_KEY, orders);
}

function statusFromLegacy(status: string): OrderStatus {
  return status === '已付款' ? 'paid' : status as OrderStatus;
}

export async function getOrders(options?: ApiRequestOptions): Promise<Order[]> {
  if (!USE_MOCK_API) return assertApiData(await apiGet<unknown>('/api/me/orders', options), isOrders, '訂單列表');
  return readMockOrders().map((order) => ({ ...order, status: statusFromLegacy(order.status) }));
}

export async function createOrder(
  payload: CreateOrderRequest,
  idempotencyKey: string,
  options?: ApiRequestOptions,
): Promise<CreateOrderResponse> {
  if (payload.items.length === 0 || payload.items.length > 50
    || payload.items.some((item) => !Number.isSafeInteger(item.productId) || item.productId <= 0
      || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 999
      || (item.variant !== undefined && typeof item.variant !== 'string'))) {
    throw new Error('購物車商品數量不正確，請重新確認');
  }
  if (!USE_MOCK_API) {
    const response = await apiPost<unknown>('/api/orders', payload, {
      ...options,
      headers: { ...options?.headers, 'Idempotency-Key': idempotencyKey },
    });
    return assertApiData(response, isCreateOrderResponse, '建立訂單');
  }

  const products = await Promise.all(payload.items.map(({ productId }) => getProduct(productId)));
  if (products.some((product): product is undefined => !product)) {
    throw new Error('部分商品已不存在，請重新整理購物車');
  }

  const items = payload.items.map((item, index) => ({
    product: products[index] as Product,
    quantity: item.quantity,
    variant: item.variant,
  }));

  const stockShortage = items.find((item) => item.quantity > item.product.stock);
  if (stockShortage) {
    throw new Error(`「${stockShortage.product.name}」庫存不足，目前僅剩 ${stockShortage.product.stock} 件`);
  }
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 1000 ? 0 : 80;
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const order: Order = {
    orderNumber: `IMPACT-${datePart}-${String(Date.now()).slice(-6)}`,
    date: now.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
    ...payload.recipient,
    paymentMethod: payload.paymentMethod,
    items,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
    status: 'payment_pending',
  };

  writeMockOrders([order, ...readMockOrders()]);
  return { order };
}
