import * as React from 'react';
import  useClient  from "./useClient";

/**
 * Get the latest network error, unless it has been
 * dismissed or there has been a successful response
 * since.
 * 
 * N.B. ignores errors thrown before you call useNetworkError
 */
export default function useNetworkError(): [Error | null, () => void] {
  const client = useClient();
  const [error, setError] = React.useState<Error | null>(null);
  React.useEffect(() => {
    const subscriptionA = client.subscribeToNetworkErrors(error => {
      setError(error);
    });
    const subscriptionB = client.subscribeToSuccessfulResponse(() => {
      setError(null);
    });
    return () => {
      subscriptionA.unsubscribe();
      subscriptionB.unsubscribe();
    }
  }, [client])
  return [error, () => setError(null)];
}