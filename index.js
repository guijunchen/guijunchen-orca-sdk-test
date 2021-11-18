const { readFile } = require("mz/fs");
const { Connection, Keypair } = require("@solana/web3.js");
const { getOrca, OrcaFarmConfig, OrcaPoolConfig } = require("@orca-so/sdk");
const Decimal = require("decimal.js");

const main = async () => {
  /*** Setup ***/
  // 1. Read secret key file to get owner keypair
  ///Users/book/.config/solana/id.json
  ///Users/scuba/my-wallet/my-keypair.json
  const secretKeyString = await readFile("/Users/book/.config/solana/id.json", {
    encoding: "utf8",
  });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const owner = Keypair.fromSecretKey(secretKey);

  // 2. Initialzie Orca object with mainnet connection
  const connection = new Connection("https://api.mainnet-beta.solana.com", "singleGossip");
  const orca = getOrca(connection);

  try {
    /*** Swap ***/
    // 3. We will be swapping 0.1 SOL for some ORCA
    const orcaSolPool = orca.getPool(OrcaPoolConfig.SOL_USDT)
    //获取第二个币usdt币的信息
    const solToken = orcaSolPool.getTokenB();
    console.log("==solToken:", solToken)
    const solAmount = new Decimal(1);
    const quote = await orcaSolPool.getQuote(solToken, solAmount);
    // const orcaAmount = quote.getExpectedOutputAmount();
    const orcaAmount = quote.getMinOutputAmount();

    // const orcaSolPool = orca.getPool(OrcaPoolConfig.ORCA_SOL);
    // const solToken = orcaSolPool.getTokenB();
    // const solAmount = new Decimal(1);
    // const quote = await orcaSolPool.getQuote(solToken, solAmount);
    // const orcaAmount = quote.getMinOutputAmount();

    console.log(`Swap ${solAmount.toString()} SOL for at least ${orcaAmount.toNumber()} ORCA`);

    // const swapPayload = await orcaSolPool.swap(owner, solToken, solAmount, orcaAmount);
    // const swapTxId = await swapPayload.execute();
    // console.log("Swapped:", swapTxId, "\n");

    
  } catch (err) {
    console.warn(err);
  }
};

main()
  .then(() => {
    console.log("Done");
  })
  .catch((e) => {
    console.error(e);
  });


  //
  //
