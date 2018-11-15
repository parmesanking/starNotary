const PrivateKeyProvider = require("truffle-privatekey-provider");
/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 5000000,
    }
    ,rinkeby: {
      provider: new PrivateKeyProvider(process.env.PRIVATE_KEY, "https://rinkeby.infura.io/v3/e56c1da114c844fd8ff87d3691b3302e"),
      network_id: 4,
      gas: 7000000
    }
  },
  
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
};
