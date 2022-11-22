import hardhat, { ethers, web3 } from "hardhat";
import { addressBook } from "blockchain-addressbook";
import { predictAddresses } from "../utils/predictAddresses";
import { setPendingRewardsFunctionName } from "../utils/setPendingRewardsFunctionName";

const registerSubsidy = require("../utils/registerSubsidy");

let {
  platforms: { pancake, beefyfinance },
  tokens: {
    CAKE: { address: CAKE }, // This pulls the addresses from the address book, new tokens will probably not be in there yet.
    WBNB: { address: WBNB },
    BUSD: { address: BUSD },
  },
} = addressBook.bsc;

WBNB = "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684";
CAKE = "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7"; // BUSD


//const newToken = web3.utils.toChecksumAddress("0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"); Can add new tokens like this for deployment.
const want = web3.utils.toChecksumAddress("0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"); // Add the address of the underlying LP.

const vaultParams = {
  mooName: "Moo CakeV2 CAKE-BNB", // Update the mooName.
  mooSymbol: "mooCakeV2CAKE-BNB", // Update the mooSymbol.
  delay: 21600,
};

const strategyParams = {
  want: "0xBAa1D7506274FD4B298c395ca865027aE3Ed36A6",
  poolId: 2, // Add the poolId.
  chef: "0x61d777dC41Bb391c491a644974C18fC069Ad3e62",
  // chef: pancake.masterchefV2,
  // unirouter: pancake.router,
  unirouter: "0xCDe540d7eAFE93aC5fE6233Bee57E1270D3E330F",
  strategist: process.env.STRATEGIST_ADDRESS, // Add your public address or pull it from the .env file.
  keeper: beefyfinance.keeper,
  beefyFeeRecipient: beefyfinance.beefyFeeRecipient,
  beefyFeeConfig: beefyfinance.beefyFeeConfig,
  outputToNativeRoute: [CAKE, WBNB], // Add the route to convert from the reward token to the native token.
  outputToLp0Route: [CAKE, CAKE], // Add the route to convert your reward token to token0.
  outputToLp1Route: [CAKE, WBNB], // Add the route to convert your reward token to token1.
  shouldSetPendingRewardsFunctionName: true,
  pendingRewardsFunctionName: "pendingCake",
};

const contractNames = {
  vault: "BeefyVaultV6", // Add the vault name which will be deployed.
  strategy: "StrategyCommonChefLP", // Add the strategy name which will be deployed along with the vault.
};

async function main() {
  if (
    Object.values(vaultParams).some(v => v === undefined) ||
    Object.values(strategyParams).some(v => v === undefined) ||
    Object.values(contractNames).some(v => v === undefined)
  ) {
    console.error("one of config values undefined");
    return;
  }

  await hardhat.run("compile");

  const Vault = await ethers.getContractFactory(contractNames.vault);
  const Strategy = await ethers.getContractFactory(contractNames.strategy);

  const [deployer] = await ethers.getSigners();

  console.log("Deploying:", vaultParams.mooName);

  const predictedAddresses = await predictAddresses({ creator: deployer.address });

  const vaultConstructorArguments = [
    predictedAddresses.strategy,
    vaultParams.mooName,
    vaultParams.mooSymbol,
    vaultParams.delay,
  ];
  const vault = await Vault.deploy(...vaultConstructorArguments);
  await vault.deployed();

  const strategyConstructorArguments = [
    strategyParams.want,
    strategyParams.poolId,
    strategyParams.chef,
    [
      vault.address,
      strategyParams.unirouter,
      strategyParams.keeper,
      strategyParams.strategist,
      strategyParams.beefyFeeRecipient,
      strategyParams.beefyFeeConfig,
    ],
    strategyParams.outputToNativeRoute,
    strategyParams.outputToLp0Route,
    strategyParams.outputToLp1Route,
  ];

  const strategy = await Strategy.deploy(...strategyConstructorArguments);
  await strategy.deployed();

  // add this info to PR
  console.log();
  console.log("Vault:", vault.address);
  console.log("Strategy:", strategy.address);
  console.log("Want:", strategyParams.want);
  console.log("PoolId:", strategyParams.poolId);

  console.log();
  console.log("Running post deployment");

  await setPendingRewardsFunctionName(strategy, strategyParams.pendingRewardsFunctionName);

  await vault.transferOwnership(beefyfinance.vaultOwner);
  console.log(`Transfered Vault Ownership to ${beefyfinance.vaultOwner}`);

  if (hardhat.network.name === "bsc") {
    await registerSubsidy(vault.address, deployer);
    await registerSubsidy(strategy.address, deployer);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
