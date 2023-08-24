import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { parseUnits } from "ethers/lib/utils";

describe("MintableToken", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const [owner, serviceReciver, otherAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MintableToken");
    const token = await Token.deploy(
      "Betix",
      "BETX",
      18,
      parseUnits("1000000000"),
      serviceReciver.address,
      parseUnits("1"),
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

      expect(await serviceReciver.getBalance()).to.equal(parseUnits("10005"));
    });

    it("Should have the right totalSupply", async function () {
      const { token } = await loadFixture(deployFixture);

      expect(await token.totalSupply()).to.equal(parseUnits("1000000000"));
    });

    it("Should total supply increase after mint", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      await token.connect(owner).mint(parseUnits("1000000000"));
      expect(await token.totalSupply()).to.equal(parseUnits("2000000000"));
    });
  });
});
