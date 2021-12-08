//from https://github.com/OpenDevICON/token-score-factory/blob/6f3d17d52654f9f755ce58b3659cec32935fd48d/Frontend/src/Helpers/fetchContractContent.js
function padLeadingZeros(num, size) {
  var s = num;
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
}

export const fetchContractContent = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(url);
      let arrayBuffer = await response.arrayBuffer();
      let byteArray = new Uint8Array(arrayBuffer);
      let contentInHex = "";
      for (var i = 0; i < byteArray.length; ++i) {
        const byteInHex = padLeadingZeros(byteArray[i].toString("16"), 2);
        contentInHex = contentInHex + byteInHex;
      }

      let contractContent = "0x" + contentInHex;
      //console.log(contractContent);
      resolve(contractContent);
    } catch (err) {
      reject(err);
    }
  });
};
