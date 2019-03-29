import { Socket } from "phoenix";
import { getToken } from "./State/tokens";
import getBackendUrls from "./State/get-backend-urls";

let socket: Socket;

function defineSocket  (props: DefineParams) {
  // if we are disconnected, phoenix will keep trying to connect which means
  // we will keep dispatching disconnect.  So we track if we already dispatched
  // disconnect (socketDisconnectedCount = 1) and if so we do not send another
  // message.  We only dispatch the message if socketDisconnectedCount = 0.
  let socketDisconnectedCount = 0;

  function appConnect(token = getToken()) {
    const params = makeParams(token);
    socket = new Socket(getBackendUrls().websocketUrl, params);
    socket.connect();

    socket.onOpen(() => {
      dispatchConnected();
    });

    socket.onError(() => {
      dispatchDisconnected();
    });

    socket.onClose(() => {
      dispatchDisconnected();
    });

    return socket;
  }

  appConnect();

  function dispatchDisconnected() {
    if (socketDisconnectedCount === 0) {
      if (props.onConnChange) {
        props.onConnChange(false);
      }
      socketDisconnectedCount = 1;
    }
  }

  function dispatchConnected() {
    if (props.onConnChange) {
      props.onConnChange(true);
    }

    socketDisconnectedCount = 0;
  }

  function makeParams(token?: string | null) {
    const params = {} as { token?: string };

    if (token) {
      params.token = token;
    }

    return { params };
  }

  return socket;
};

export function getSocket(params: DefineParams = {}) {
  if (socket) {
    return socket;
  }

  return defineSocket(params);
}

export default getSocket;

interface DefineParams {
  onConnChange?: (connStatus: boolean) => void;
}
