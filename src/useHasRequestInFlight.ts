import * as React from 'react';
import useClient from "./useClient";

/**
 * Check if there are any requests in flight. Ignores requests
 * sent before useHasRequestInFlight is called
 */
export default function useHasRequestInFlight(): boolean {
  const client = useClient();
  const [hasRequestInFlight, set] = React.useState<boolean>(false);
  React.useEffect(() => {
    const subscriptionA = client.subscribeToQueueRequest(() => {
      set(true);
    });
    const subscriptionB = client.subscribeToSuccessfulResponse((pendingMutations) => {
      if (!pendingMutations) {
      set(false);
      }
    });
    return () => {
      subscriptionA.unsubscribe();
      subscriptionB.unsubscribe();
    }
  }, [client])
  return hasRequestInFlight;
}