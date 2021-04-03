const Block = require("./block");
const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

describe("Block", () => {
  const timestamp = "a-date";
  const lastHash = "foo-hash";
  const hash = "bar-hash";
  const data = ["blockchain", "data"];
  const block = new Block({ timestamp, lastHash, hash, data });

  it("has correct value", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });

  describe("genesis method", () => {
    const genesisBlock = Block.genesis();

    it("a Block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it("returns correct data", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe("mineBlock method", () => {
    const lastBlock = Block.genesis();
    const data = "mined data";
    const minedBlock = Block.mineBlock({ lastBlock, data });

    it("a Block instance", () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it("sets correct hash", () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it("sets correct data", () => {
      expect(minedBlock.data).toEqual(data);
    });

    it("sets correct timestamp", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it("creates correct hash", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(minedBlock.timestamp, lastBlock.hash, data)
      );
    });
  });
});
