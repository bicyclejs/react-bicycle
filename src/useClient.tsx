import BicycleClient from 'bicycle/client';
import { useContext } from './context';

export default function useClient(): BicycleClient {
  return useContext().client;
}
