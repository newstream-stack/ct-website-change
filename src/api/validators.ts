import type { AuthResponse } from '../types/auth';
import type { Member, MemberStats } from '../types/member';
import type { NewsItem } from '../types/news';
import type { CreateOrderResponse, Order, Product } from '../types/product';
import type { PaymentStatusResponse } from '../types/payment';
import type { AdItem, ActionPlan, AllianceMember, Columnist } from '../types/news';
import type { DonationRecord, SubscriptionRecord } from '../types/member';
import type { EventDetail, EventTicket } from '../types/event';
import type { MembershipPlan } from '../types/membership';
import type { Plan } from '../types/donation';
import type { FeaturedAd, FeaturedVideo } from '../mocks/accordionPanels';
import type { EpaperIssue, EpaperIssueSummary } from '../types/epaper';

export const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const isString = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

export function assertApiData<T>(value: unknown, validator: (input: unknown) => input is T, resource: string): T {
  if (!validator(value)) throw new Error(`${resource}回應格式不正確`);
  return value;
}

export const isNewsItem = (value: unknown): value is NewsItem => isRecord(value)
  && Number.isInteger(value.id) && isString(value.title) && isString(value.excerpt)
  && isString(value.category) && isString(value.author) && isString(value.date) && isString(value.imageUrl)
  && (value.content === undefined || isString(value.content))
  && (value.subCategory === undefined || isString(value.subCategory))
  && (value.tags === undefined || (Array.isArray(value.tags) && value.tags.every(isString)));

export const isNewsItems = (value: unknown): value is NewsItem[] => Array.isArray(value) && value.every(isNewsItem);

export const isAdItem = (value: unknown): value is AdItem => isRecord(value)
  && isString(value.id) && isString(value.sponsor) && isString(value.title)
  && isString(value.description) && isString(value.imageUrl) && isString(value.link);

export const isAllianceMember = (value: unknown): value is AllianceMember => isRecord(value)
  && isString(value.id) && isString(value.name) && isString(value.logoUrl)
  && isString(value.latestArticleTitle) && isString(value.latestArticleDate)
  && Number.isInteger(value.latestArticleId);

export const isColumnist = (value: unknown): value is Columnist => isRecord(value)
  && isString(value.id) && isString(value.name) && isString(value.avatarUrl)
  && isString(value.subCategory) && isString(value.latestArticleTitle)
  && isString(value.latestArticleDate) && Number.isInteger(value.latestArticleId);

export const isFeaturedVideo = (value: unknown): value is FeaturedVideo => isRecord(value)
  && isString(value.id) && isString(value.title) && isString(value.videoId)
  && isString(value.thumbnail) && isString(value.category) && isString(value.description);

export const isFeaturedAd = (value: unknown): value is FeaturedAd => isRecord(value)
  && isString(value.imageUrl) && isString(value.title) && isString(value.description)
  && isString(value.sponsor) && isString(value.link);

export const isProduct = (value: unknown): value is Product => isRecord(value)
  && Number.isInteger(value.id) && isString(value.name) && isString(value.englishName)
  && isNumber(value.price) && value.price >= 0 && isString(value.imageUrl)
  && isString(value.description) && Array.isArray(value.specs) && value.specs.every(isString)
  && isString(value.details) && Array.isArray(value.gallery) && value.gallery.every(isString);

export const isAuthResponse = (value: unknown): value is AuthResponse => isRecord(value)
  && isString(value.token) && isRecord(value.user) && isString(value.user.id)
  && isString(value.user.name) && isString(value.user.email)
  && (value.refreshToken === undefined || isString(value.refreshToken))
  && (value.expiresAt === undefined || isString(value.expiresAt));

export const isMember = (value: unknown): value is Member => isRecord(value)
  && isString(value.name) && isString(value.displayName) && isString(value.email) && isString(value.address)
  && (value.avatarUrl === undefined || isString(value.avatarUrl))
  && isRecord(value.subscription) && isString(value.subscription.plan) && isNumber(value.subscription.price)
  && isString(value.subscription.nextBillingDate)
  && (value.subscription.status === 'active' || value.subscription.status === 'cancelled' || value.subscription.status === 'expired');

export const isMemberStats = (value: unknown): value is MemberStats => isRecord(value)
  && isNumber(value.savedArticles) && isNumber(value.attendedEvents)
  && isNumber(value.donationCount) && isNumber(value.totalDonated)
  && value.savedArticles >= 0 && value.attendedEvents >= 0 && value.donationCount >= 0 && value.totalDonated >= 0;

export const isDonationRecord = (value: unknown): value is DonationRecord => isRecord(value)
  && isString(value.id) && isString(value.date) && isString(value.project)
  && (value.projectUrl === undefined || isString(value.projectUrl)) && isString(value.method)
  && isString(value.amount) && isString(value.name);

export const isSubscriptionRecord = (value: unknown): value is SubscriptionRecord => isRecord(value)
  && isString(value.date) && isString(value.item) && isString(value.amount)
  && (value.status === '扣款成功' || value.status === '扣款失敗');

const isEventTicket = (value: unknown): value is EventTicket => isRecord(value)
  && isString(value.id) && isString(value.name) && isNumber(value.price) && value.price >= 0
  && Array.isArray(value.features) && value.features.every(isString);

export const isEventDetail = (value: unknown): value is EventDetail => isRecord(value)
  && isString(value.id) && isString(value.name) && isString(value.eyebrow)
  && isString(value.description) && isString(value.imageUrl) && isString(value.dateLabel)
  && isString(value.venue) && Array.isArray(value.tickets) && value.tickets.every(isEventTicket);

export const isMembershipPlan = (value: unknown): value is MembershipPlan => isRecord(value)
  && isString(value.id) && isString(value.name) && isNumber(value.price) && value.price >= 0
  && (value.billingPeriod === 'month' || value.billingPeriod === 'year')
  && isString(value.description) && Array.isArray(value.features) && value.features.every(isString)
  && typeof value.isPopular === 'boolean';

export const isPlan = (value: unknown): value is Plan => isRecord(value)
  && Number.isInteger(value.id) && isString(value.title) && isString(value.imageUrl)
  && isString(value.description);

const isActionPlan = (value: unknown): value is ActionPlan => isRecord(value)
  && isString(value.id) && isString(value.title) && isString(value.description)
  && (value.subtitle === undefined || isString(value.subtitle))
  && (value.price === undefined || isString(value.price))
  && (value.isPremium === undefined || typeof value.isPremium === 'boolean')
  && (value.variant === 'subscription' || value.variant === 'donation');

export const isSubscriptionPageData = (value: unknown): value is {
  bgText: string; subtitle: string; titleLines: string[]; plans: ActionPlan[];
} => isRecord(value) && isString(value.bgText) && isString(value.subtitle)
  && Array.isArray(value.titleLines) && value.titleLines.every(isString)
  && Array.isArray(value.plans) && value.plans.every(isActionPlan);

export const isOrder = (value: unknown): value is Order => isRecord(value)
  && isString(value.orderNumber) && isString(value.date) && isString(value.name)
  && isString(value.phone) && isString(value.email) && isString(value.address)
  && (value.paymentMethod === 'credit-card' || value.paymentMethod === 'line-pay') && Array.isArray(value.items)
  && value.items.every((item) => isRecord(item) && isProduct(item.product) && Number.isInteger(item.quantity) && Number(item.quantity) > 0)
  && isNumber(value.subtotal) && isNumber(value.shippingFee) && isNumber(value.total)
  && value.subtotal >= 0 && value.shippingFee >= 0 && value.total >= 0
  && ['pending', 'payment_pending', 'paid', 'failed', 'cancelled', 'refunded'].includes(String(value.status));

export const isOrders = (value: unknown): value is Order[] => Array.isArray(value) && value.every(isOrder);

export const isCreateOrderResponse = (value: unknown): value is CreateOrderResponse => isRecord(value)
  && isOrder(value.order) && (value.paymentUrl === undefined || isString(value.paymentUrl));

export const isPaymentStatusResponse = (value: unknown): value is PaymentStatusResponse => isRecord(value)
  && ['order', 'membership', 'donation', 'event'].includes(String(value.type))
  && isString(value.reference)
  && ['pending', 'payment_pending', 'paid', 'failed', 'cancelled', 'refunded', 'confirmed', 'active'].includes(String(value.status))
  && (value.message === undefined || isString(value.message));

export const isEpaperIssueSummary = (value: unknown): value is EpaperIssueSummary => isRecord(value)
  && Number.isInteger(value.issueNumber) && Number(value.issueNumber) > 0 && isString(value.dateLabel);

export const isEpaperIssueSummaries = (value: unknown): value is EpaperIssueSummary[] =>
  Array.isArray(value) && value.every(isEpaperIssueSummary);

export const isEpaperIssue = (value: unknown): value is EpaperIssue => isRecord(value)
  && Number.isInteger(value.issueNumber) && Number(value.issueNumber) > 0
  && isString(value.dateLabel) && Array.isArray(value.pages) && value.pages.length > 0
  && value.pages.every((page) => isRecord(page) && Number.isInteger(page.pageNumber) && Number(page.pageNumber) > 0 && isString(page.imageUrl));
