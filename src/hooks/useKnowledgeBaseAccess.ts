import { getMe } from '../api/member';
import { useAsyncData } from './useAsyncData';
import { useAuth } from './useAuth';

// Only fires getMe() once isLoggedIn is confirmed, so anonymous visitors never trigger the request.
export function useKnowledgeBaseAccess(): { isLoggedIn: boolean; isSubscribed: boolean } {
  const { isLoggedIn } = useAuth();
  const { data: member } = useAsyncData(
    `knowledge-base-member:${isLoggedIn}`,
    (signal) => (isLoggedIn ? getMe({ signal }) : Promise.resolve(null)),
    null,
  );
  return { isLoggedIn, isSubscribed: member?.subscription.status === 'active' };
}
