import { NextResponse } from "next/server";

const WALLET_NAME = "devnet-wallet";
const BTC_RPC_URL = "http://localhost:18443";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Add wallet to URL for methods that require it
    const walletMethods = [
      "getbalance",
      "sendtoaddress",
      "gettransaction",
      "listtransactions",
    ];
    const needsWallet = walletMethods.includes(body.method);
    const url = needsWallet
      ? `${BTC_RPC_URL}/wallet/${WALLET_NAME}`
      : BTC_RPC_URL;

    console.log("Making Bitcoin RPC request to:", url, "Method:", body.method);

    // Forward request to Bitcoin Core RPC
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from("devnet:devnet").toString("base64"),
      },
      body: JSON.stringify(body),
    }).catch((error) => {
      console.error("Bitcoin RPC connection error:", error);
      throw new Error(
        "Failed to connect to Bitcoin RPC. Is Bitcoin Core running?"
      );
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Bitcoin RPC error response:", errorText);
      throw new Error(`Bitcoin RPC error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.error) {
      console.error("Bitcoin RPC returned error:", data.error);
      throw new Error(`Bitcoin RPC error: ${data.error.message}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Bitcoin API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Make sure Bitcoin Core is running and wallet is loaded",
      },
      { status: 500 }
    );
  }
}
