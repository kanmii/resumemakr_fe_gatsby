export function makeConnectionObject() {
  let connectionStatus = window.____resumemakr.connectionStatus;

  if (!connectionStatus) {
    connectionStatus = {} as ConnectionStatus;
    window.____resumemakr.connectionStatus = connectionStatus;
  }

  return connectionStatus;
}

export function resetConnectionObject() {
  delete window.____resumemakr.connectionStatus;
  return makeConnectionObject();
}

export function storeConnectionStatus(
  isConnected: boolean,
  mode: "auto" | "manual" = "auto"
) {
  const prevConnectionStatus = getConnectionStatus();

  // "auto" means the status was adopted from inside phoenix socket and manual
  // means we set it ourselves. The manual mode is necessary so we can
  // simulate offline mode while in end to end test. As we can not determine
  // when phoenix socket will attempt to set the connection status, we ensure
  // that if we have set it manually, then 'auto' setting should not work.
  if (
    prevConnectionStatus &&
    prevConnectionStatus.mode === "manual" &&
    mode === "auto"
  ) {
    return;
  }

  const { connectionStatus } = window.____resumemakr;
  connectionStatus.mode = mode;
  connectionStatus.isConnected = isConnected;

  return connectionStatus;
}

export function isConnected() {
  const connectionStatus = getConnectionStatus();

  return connectionStatus ? connectionStatus.isConnected : null;
}

function getConnectionStatus() {
  return window.____resumemakr.connectionStatus;
}

export interface ConnectionStatus {
  isConnected: boolean;
  mode: "auto" | "manual";
}
