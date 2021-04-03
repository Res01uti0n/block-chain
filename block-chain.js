const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class BlockChain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });

    this.chain.push(newBlock);
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) return false;

    if (!BlockChain.isValidChain(chain)) return false;

    this.chain = chain;
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const actualLastHash = chain[i - 1].hash;

      const { lastHash, hash, data, timestamp } = block;

      if (lastHash !== actualLastHash) return false;

      const validateHash = cryptoHash(timestamp, lastHash, data);

      if (hash !== validateHash) return false;
    }

    return true;
  }
}

module.exports = { BlockChain };
