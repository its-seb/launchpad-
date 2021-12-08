import IconService from "icon-sdk-js";

const { IconConverter } = IconService;

class ICONexConnection {
  getWalletAddress() {
    return this.ICONexRequest("REQUEST_ADDRESS");
  }

  getJsonRpc(jsonRpcQuery) {
    return this.ICONexRequest("REQUEST_JSON-RPC", jsonRpcQuery);
  }

  callTransaction(txObj) {
    const jsonRpcQuery = {
      jsonrpc: "2.0",
      method: "icx_sendTransaction",
      params: IconConverter.toRawTransaction(txObj),
      id: 1234,
    };
    return this.getJsonRpc(jsonRpcQuery);
  }

  ICONexRequest(requestType, payload) {
    return new Promise((resolve, reject) => {
      function eventHandler(event) {
        const { payload } = event.detail;
        window.removeEventListener("ICONEX_RELAY_RESPONSE", eventHandler);
        resolve(payload);
      }
      window.addEventListener("ICONEX_RELAY_RESPONSE", eventHandler);

      window.dispatchEvent(
        new window.CustomEvent("ICONEX_RELAY_REQUEST", {
          detail: {
            type: requestType,
            payload,
          },
        })
      );
    });
  }
}

export async function estimateStepsforDeployment(from, content, params) {
  const timestampInDecimal = Date.now() * 1000;
  const timestamp = "0x" + timestampInDecimal.toString(16); //to hex string
  const txObj = {
    jsonrpc: "2.0",
    method: "debug_estimateStep",
    id: 1234,
    params: {
      version: "0x3",
      from,
      to: "cx0000000000000000000000000000000000000000", //selectedNetworkData.CONTRACT_DEPLOY_ADDRESS,
      timestamp,
      nid: "0x53", //0x53 for sejong ; selectedNetworkData.NID,
      nonce: "0x1",
      dataType: "deploy",
      data: {
        contentType: "application/zip",
        content, // compressed SCORE data
        params,
      },
    },
  };
  try {
    const responsePromise = await fetch(
      "https://sejong.net.solidwallet.io/api/v3d",
      {
        method: "POST",
        body: JSON.stringify(txObj),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseJSON = await responsePromise.json();

    return responseJSON.result;
  } catch (err) {
    console.error("FETCH:", err);
    throw err;
  }
}

export default ICONexConnection;
