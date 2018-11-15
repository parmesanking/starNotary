const StarNotary = artifacts.require("StarNotary");

contract("StarNotary", accounts => {
  beforeEach(async function() {
    this.contract = await StarNotary.new({ from: accounts[0] });
  });

  describe("can create a star", () => {
    it("can create a star and get its name", async function() {
      var tokenId = await this.contract.tokenCounter();
      await this.contract.createStar(
        "awesome star!",
        "1",
        "2",
        "3",
        "My 1st star!",
        { from: accounts[0] }
      );

      tokenId = tokenId + 1;
      var myStar = await this.contract.tokenIdToStarInfo(tokenId);
      assert.equal(myStar[0], "awesome star!");
      assert.equal(myStar[1], "1");
      assert.equal(myStar[2], "2");
      assert.equal(myStar[3], "3");
      assert.equal(myStar[4], "My 1st star!");
    });
  });

  describe("lookup for a star", () => {
    it("check if a star exists", async function() {
      await this.contract.createStar(
        "awesome star!",
        "1",
        "2",
        "3",
        "My 1st star!",
        { from: accounts[0] }
      );
      assert.equal(
        await this.contract.checkIfStarExist("1", "2", "3", {
          from: accounts[0]
        }),
        true
      );
      assert.equal(
        await this.contract.checkIfStarExist("10", "20", "30", {
          from: accounts[0]
        }),
        false
      );
    });
  });

  describe("buying and selling stars", () => {
    let user1 = accounts[1];
    let user2 = accounts[2];
    let randomMaliciousUser = accounts[3];

    let starId = 1;
    let starPrice = web3.toWei(0.01, "ether");

    beforeEach(async function() {
      var tokenId = await this.contract.tokenCounter();
      await this.contract.createStar(
        "awesome star",
        "_" + tokenId,
        "_" + tokenId,
        "_" + tokenId,
        "good star",
        { from: user1 }
      );
      starId = tokenId.toNumber() + 1;
    });

    it("user1 can put up their star for sale", async function() {
      assert.equal(await this.contract.ownerOf(starId), user1);
      await this.contract.putStarUpForSale(starId, starPrice, { from: user1 });

      assert.equal(await this.contract.starsForSale(starId), starPrice);
    });

    describe("user2 can buy a star that was put up for sale", () => {
      beforeEach(async function() {
        await this.contract.putStarUpForSale(starId, starPrice, {
          from: user1
        });
      });

      it("user2 is the owner of the star after they buy it", async function() {
        await this.contract.buyStar(starId, {
          from: user2,
          value: starPrice,
          gasPrice: 0
        });
        assert.equal(await this.contract.ownerOf(starId), user2);
      });

      it("user2 ether balance changed correctly", async function() {
        let overpaidAmount = web3.toWei(0.05, "ether");
        const balanceBeforeTransaction = web3.eth.getBalance(user2);
        await this.contract.buyStar(starId, {
          from: user2,
          value: overpaidAmount,
          gasPrice: 0
        });
        const balanceAfterTransaction = web3.eth.getBalance(user2);

        assert.equal(
          balanceBeforeTransaction.sub(balanceAfterTransaction),
          starPrice
        );
      });
    });
  });
});
