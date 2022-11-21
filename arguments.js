// import { web3 } from "hardhat";
// import { addressBook } from "blockchain-addressbook";
// import { predictAddresses } from "../utils/predictAddresses";
// import { setPendingRewardsFunctionName } from "../utils/setPendingRewardsFunctionName";

// const registerSubsidy = require("../utils/registerSubsidy");

// const {
//   platforms: { pancake, beefyfinance },
//   tokens: {
//     CAKE: { address: CAKE }, // This pulls the addresses from the address book, new tokens will probably not be in there yet.
//     WBNB: { address: WBNB },
//     BUSD: { address: BUSD },
//   },
// } = addressBook.bsc;

// const newToken = web3.utils.toChecksumAddress("0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"); Can add new tokens like this for deployment.
// const want = web3.utils.toChecksumAddress("0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"); // Add the address of the underlying LP.

const vaultParams = {
  mooName: "Moo CakeV2 CAKE-BNB", // Update the mooName.
  mooSymbol: "mooCakeV2CAKE-BNB", // Update the mooSymbol.
  delay: 21600,
};

// const strategyParams = {
//   want: want,
//   poolId: 2, // Add the poolId.
//   chef: pancake.masterchefV2,
//   unirouter: pancake.router,
//   strategist: process.env.STRATEGIST_ADDRESS, // Add your public address or pull it from the .env file.
//   keeper: beefyfinance.keeper,
//   beefyFeeRecipient: beefyfinance.beefyFeeRecipient,
//   beefyFeeConfig: beefyfinance.beefyFeeConfig,
//   outputToNativeRoute: [CAKE, WBNB], // Add the route to convert from the reward token to the native token.
//   outputToLp0Route: [CAKE, CAKE], // Add the route to convert your reward token to token0.
//   outputToLp1Route: [CAKE, WBNB], // Add the route to convert your reward token to token1.
//   shouldSetPendingRewardsFunctionName: true,
//   pendingRewardsFunctionName: "pendingCake",
// };

const vaultConstructorArguments = [
  "0x7fb426beacda960718d5f08c6dbfeda51970ca4a",
  vaultParams.mooName,
  vaultParams.mooSymbol,
  vaultParams.delay,
];

// const strategyConstructorArguments = [
//   strategyParams.want,
//   strategyParams.poolId,
//   strategyParams.chef,
//   [
//     vault.address,
//     strategyParams.unirouter,
//     strategyParams.keeper,
//     strategyParams.strategist,
//     strategyParams.beefyFeeRecipient,
//     strategyParams.beefyFeeConfig,
//   ],
//   strategyParams.outputToNativeRoute,
//   strategyParams.outputToLp0Route,
//   strategyParams.outputToLp1Route,
// ];

console.log(vaultConstructorArguments);
module.exports = vaultConstructorArguments;
