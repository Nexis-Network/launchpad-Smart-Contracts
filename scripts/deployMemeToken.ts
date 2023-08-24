import { ethers } from "hardhat";
import { parseUnits } from "ethers/lib/utils";

async function main() {
  const owner = "0x14b02E90305Cb16493475cb764194CCDA163c46C";

  const params = [
    "ABC",
    "ABC",
    18,
    parseUnits("1000000000", 18).toString(),
    owner,
    0,
  ] as const;

  const Token = await ethers.getContractFactory("MemeToken");
  const token = await Token.deploy(...params, { value: 0 });

  console.log(token.address, ...params);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
