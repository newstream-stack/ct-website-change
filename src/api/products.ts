import type { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/index';
import { apiGet, type ApiRequestOptions } from './client';
import { USE_MOCK_API } from './config';
import { assertApiData, isProduct } from './validators';

const isProducts = (value: unknown): value is Product[] => Array.isArray(value) && value.every(isProduct);

export async function getProducts(limit?: number, options?: ApiRequestOptions): Promise<Product[]> {
  if (USE_MOCK_API) return typeof limit === 'number' ? MOCK_PRODUCTS.slice(0, Math.max(0, limit)) : MOCK_PRODUCTS;
  const query = typeof limit === 'number' ? `?limit=${Math.max(0, limit)}` : '';
  return assertApiData(await apiGet<unknown>(`/api/products${query}`, options), isProducts, '商品列表');
}

export async function getProduct(id: number, options?: ApiRequestOptions): Promise<Product | undefined> {
  return USE_MOCK_API ? MOCK_PRODUCTS.find((product) => product.id === id) : assertApiData(await apiGet<unknown>(`/api/products/${id}`, options), isProduct, '商品');
}

export async function getRelatedProducts(id: number, limit = 4, options?: ApiRequestOptions): Promise<Product[]> {
  if (USE_MOCK_API) return MOCK_PRODUCTS.filter((product) => product.id !== id).slice(0, limit);
  return assertApiData(await apiGet<unknown>(`/api/products/${id}/related?limit=${limit}`, options), isProducts, '相關商品');
}

export async function searchProducts(query: string, limit = 5, options?: ApiRequestOptions): Promise<Product[]> {
  const normalizedQuery = query.trim().toLocaleLowerCase('zh-TW');
  if (!normalizedQuery || limit <= 0) return [];
  if (!USE_MOCK_API) return assertApiData(await apiGet<unknown>(`/api/products/search?q=${encodeURIComponent(query)}&limit=${limit}`, options), isProducts, '商品搜尋');

  return MOCK_PRODUCTS.filter((product) =>
    [product.name, product.englishName, product.description]
      .some((value) => value.toLocaleLowerCase('zh-TW').includes(normalizedQuery)),
  ).slice(0, limit);
}
