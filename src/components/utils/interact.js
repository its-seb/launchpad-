import IconService from "icon-sdk-js";
// import { add0xPrefix } from "icon-sdk-js/build/data/Hexadecimal";

const { IconConverter } = IconService;

class ICONexConnection {

  getWalletAddress() {
    let wallet_address = this.ICONexRequest("REQUEST_ADDRESS");
    return wallet_address
  }

  async retrieve_all_user_transaction(wallet_address) {
    let page = 1
    let url_with_address = 'https://sejong.tracker.solidwallet.io/v3/address/txList?page=1&count=100&address=' + wallet_address
    try {
      const responsePromise = await fetch(
        url_with_address,
        {
          method: "GET",
        }
      );
      const responseJSON = await responsePromise.json();

      console.log(responseJSON.data);
    } catch (err) {
      console.error("FETCH:", err);
      throw err;
    }
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
      "https://sejong.net.solidwallet.io/api/v3d", //remember to throw everything into const file
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
