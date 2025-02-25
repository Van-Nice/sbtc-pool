async function checkBalances(btcAddress: string, stacksAddress: string) {
  // Check BTC balance
  const btcResponse = await fetch("http://localhost:18443/", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + Buffer.from("devnet:devnet").toString("base64"),
      },
      body: JSON.stringify({
          jsonrpc: "1.0",
          id: "check-balance",
          method: "getbalance",
          params: [],
      }),
  });
  const btcData = await btcResponse.json();
  
  // Check STX balance
  const stxResponse = await fetch(`http://localhost:3999/v2/accounts/${stacksAddress}`);
  const stxData = await stxResponse.json();
  
  console.log("BTC Balance:", btcData.result);
  console.log("STX Balance:", parseInt(stxData.balance) / 1000000);
}

// Replace with your addresses
checkBalances("your_btc_address", "your_stacks_address").catch(console.error);