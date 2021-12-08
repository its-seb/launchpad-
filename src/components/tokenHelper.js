export const tokenTypeMapping = [
  {
    name: "Burnable IRC3",
    value: "burnable_irc3",
    accessType: "Role Based",
    transferType: "Unstoppable",

    burnable: true,
    mintable: true,
    approval: true,
    tokenUri: true,
    irc1363: true,
    verifiedSourceCode: true,
    removeCopyright: false,

    tokenUrl:
      "https://raw.githubusercontent.com/OpenDevICON/token-score-factory/master/zips/burnable_irc3.zip",
    tokenUrlOnlyOwner:
      "https://raw.githubusercontent.com/OpenDevICON/token-score-factory/master/zips/owner_burnable_irc3.zip",
    estimatedTransactionFee: 13.39,
    estimatedTransactionFeeOnlyOwner: 13.43,
    tokenInformation: ["name", "symbol"],
  },
];

export const networkMapping = [
  {
    name: "ICON Testnet (Sejong)",
    value: "sejong",
    NID: "0x53",
    NODE_URL: "https://sejong.net.solidwallet.io/api/v3",
    NODE_DEBUG_URL: "https://sejong.net.solidwallet.io/api/debug/v3",
    TRACKER_URL: "https://sejong.tracker.solidwallet.io",
    CONTRACT_DEPLOY_ADDRESS: "cx0000000000000000000000000000000000000000",
    CONTRACT_STATUS_ADDRESS: "cx0000000000000000000000000000000000000001",
  },
];
