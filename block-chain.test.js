const Block = require("./block");
const { BlockChain } = require("./block-chain");

describe("Blockchain", () => {
  let blockChain = new BlockChain();

  it("has a chain", () => {
    expect(blockChain.chain instanceof Array).toBe(true);
  });

  it("starts with genesis", () => {
    expect(blockChain.chain[0]).toEqual(Block.genesis());
  });

  it("addBlock", () => {
    const newData = "foo bar";
    blockChain.addBlock({ data: newData });
    expect(blockChain.chain[blockChain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidHash method", () => {
    beforeEach(() => {
      blockChain = new BlockChain();
      blockChain.addBlock({ data: "1chain" });
      blockChain.addBlock({ data: "2chain" });
      blockChain.addBlock({ data: "3chain" });
    });

    describe("doesn`t start with genesis", () => {
      it("not valid", () => {
        blockChain.chain[0] = { data: "fake" };
        expect(BlockChain.isValidChain(blockChain.chain)).toBe(false);
      });
    });

    describe("has multiple blocks and correct genesis", () => {
      describe("broken lastHash", () => {
        it("not valid", () => {
          blockChain.chain[2].lastHash = "brbre";
          expect(BlockChain.isValidChain(blockChain.chain)).toBe(false);
        });
      });
    });

    describe("with invalid field", () => {
      it("not valid", () => {
        blockChain.chain[2].data = "brbre";

        expect(BlockChain.isValidChain(blockChain.chain)).toBe(false);
      });
    });

    describe("with valid input", () => {
      it("valid", () => {
        expect(BlockChain.isValidChain(blockChain.chain)).toBe(true);
      });
    });
  });

  describe("replaceChain method", () => {
    let blockChain, newChain, originalChain;

    beforeEach(() => {
      blockChain = new BlockChain();
      newChain = new BlockChain();
      originalChain = blockChain.chain;
    });

    describe("chain isn`t longer", () => {
      it("doesn`t replace", () => {
        newChain[0] = { new: 'chain' }
        blockChain.replaceChain(newChain.chain)
        expect(blockChain.chain).toEqual(originalChain);
      });
    });

    describe("chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "1chain" });
        newChain.addBlock({ data: "2chain" });
        newChain.addBlock({ data: "3chain" });
      });

      describe("invalid chain", () => {
        it("doesn`t replace", () => {
          newChain.chain[2].hash = "brbre";
          blockChain.replaceChain(newChain.chain);
          expect(blockChain.chain).toEqual(originalChain);
        });
      });

      describe("valid chain", () => {
        it("replace", () => {
          blockChain.replaceChain(newChain.chain);
          expect(blockChain.chain).toEqual(newChain.chain);
        });
      });
    });
  });
});
