import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { parseUnits } from "ethers/lib/utils";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("TaxToken", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const [owner, serviceReciver, otherAccount] = await ethers.getSigners();

    //      string memory name_,
    //     string memory symbol_,
    //     uint8 decimals_,
    //     uint256 totalSupply_,
    //     uint256 maxSupply_,
    //     uint256 maxTxAmount_,
    //     address router_,
    //     address teamWallet_,
    //     address serviceFeeReceiver_,
    //     uint256 serviceFee_

    const Token = await ethers.getContractFactory("TaxToken");
    const token = await Token.deploy(
      "Betix", //name
      "BETX", //symbol
      18, //decimals
      parseUnits("1000000000"), //totalSupply
      parseUnits("100000000000"), //maxSupply
      parseUnits("1000000"), //maxTxAmount
      "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", //router
      serviceReciver.address, //teamWallet
      serviceReciver.address, //serviceFeeReceiver
      parseUnits("1"), //serviceFee
      { value: parseUnits("1") }
    );

    return {
      owner,
      otherAccount,
      serviceReciver,
      token,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { token, owner } = await loadFixture(deployFixture);

      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should have the right decimals", async function () {
      const { token } = await loadFixture(deployFixture);

      expect(await token.decimals()).to.equal(18);
    });

    it("Should have the right fee rate", async function () {
      const { serviceReciver } = await loadFixture(deployFixture);

      expect(await serviceReciver.getBalance()).to.equal(parseUnits("10006"));
    });

    it("Should have the right totalSupply", async function () {
      const { token } = await loadFixture(deployFixture);

      expect(await token.totalSupply()).to.equal(parseUnits("1000000000"));
    });
  });
});
