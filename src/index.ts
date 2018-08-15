import BicycleClient from "bicycle/client";
import Provider from "./components/provider";
import Connect, { query, Status, RenderLoaded, RenderLoading, RenderErrors, RenderMaybeLoaded } from "./components/connect";
import connect, { ConnectProps } from "./components/connect-hoc";
import connectErrors from "./components/connect-errors";
import DeepPartial from "./DeepPartial";

export {
  Provider,
  Connect,
  query,
  Status,
  RenderLoaded,
  RenderLoading,
  RenderErrors,
  RenderMaybeLoaded,
  DeepPartial,
  connect,
  connectErrors,
  ConnectProps,
  BicycleClient
};
