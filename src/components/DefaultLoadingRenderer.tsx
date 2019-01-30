import * as React from 'react';

const DefaultLoadingElement = <div>Loading...</div>;

export default function DefaultLoadingRenderer({
  loadingDuration,
  showLoadingAfter = 1000,
}: {
  loadingDuration: number;
  showLoadingAfter?: number;
}) {
  if (loadingDuration > showLoadingAfter) {
    return DefaultLoadingElement;
  }
  return null;
}
