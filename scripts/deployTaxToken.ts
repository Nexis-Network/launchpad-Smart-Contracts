import { ethers } from "hardhat";
import { parseUnits } from "ethers/lib/utils";

async function main() {
  const owner = "0x14b02E90305Cb16493475cb764194CCDA163c46C";

  const params = [
    "ABC", //name
    "ABC", //symbol
    18, //decimals
    parseUnits("1000000000").toString(), //totalSupply
    parseUnits("1000000000000").toString(), //maxSupply
    parseUnits("1000000000").toString(), //maxTxAmount
    "0xD99D1c33F9fC3444f8101754aBC46c52416550D1", //router
    owner, //teamWallet
    owner, //serviceFeeReceiver
    0, //serviceFee
  ] as const;

  const Token = await ethers.getContractFactory("TaxToken");
  const token = await Token.deploy(...params, { value: 0 });

  console.log(token.address, ...params);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
