import * as React from 'react';
import useClient from "./useClient";

const EMPTY_ARRAY: Error[] = [];
/**
 * Get an array of errors thrown by mutations and a function to dismiss
 * a given error.
 * 
 * N.B. ignores errors thrown before you call useMutationErrors
 */
export default function useMutationErrors(): [Error[], (err: Error) => void] {
  const client = useClient();
  const [errors, setErrors] = React.useState<Error[]>(EMPTY_ARRAY);
  React.useEffect(() => {
    const subscription = client.subscribeToMutationErrors(error => {
      setErrors(errors => [...errors, error]);
    });
    return () => {
      subscription.unsubscribe();
    }
  }, [client])
  return [errors, (err: Error) => setErrors(errors => errors.filter(e => e !== err))];
}