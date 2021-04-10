const hexToBinary = require("hex-to-binary");
const Block = require("./block");
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");

describe("Block", () => {
  const timestamp = 2000;
  const lastHash = "foo-hash";
  const hash = "bar-hash";
  const data = ["blockchain", "data"];
  const nonce = 1;
  const difficulty = 1;
  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
    nonce,
    difficulty,
  });

  it("has correct value", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
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

    it("hash matches to difficulties criteria", () => {
      expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual(
        "0".repeat(minedBlock.difficulty)
      );
    });

    it("hash matches to difficulties criteria", () => {
      const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1]

      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true)
    });

    it("creates correct hash", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timestamp,
          minedBlock.nonce,
          minedBlock.difficulty,
          lastBlock.hash,
          data
        )
      );
    });
  });

  describe("adjustDifficulty method", () => {
    it("raises the difficulty", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - 100,
        })
      ).toEqual(block.difficulty + 1);
    });

    it("lowers the difficulty", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100,
        })
      ).toEqual(block.difficulty - 1);
    })

    it("lower then 1", () => {
      block.difficulty = -1
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
        })
      ).toEqual(1);
    });
  });
});
